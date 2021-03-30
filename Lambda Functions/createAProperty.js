'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
    const body = JSON.parse(event.body);
    var response;
    
    // Identify the user
    var userParams = {
      TableName: "User",
      KeyConditionExpression: "#id = :userid",
      ExpressionAttributeNames: {
        "#id": "user_id"
      },
      ExpressionAttributeValues: {
        ":userid": event.requestContext.authorizer.claims.sub
      }
    };
    const user = await documentClient.query(userParams, function(err, data) {
      if (err) 
      {
          console.error("Unable to query for user. Error:", JSON.stringify(err, null, 2));
          response = {
            statusCode: 200,
            body: JSON.stringify({
              statusCode: 400,
              message: "Error occured while searching for user"
            })
          };
          return response;
      } 
    }).promise();
    
    // Get all of the login_credentials for the user
    var credentialsParams = {
      TableName: "Login_Credentials",
      IndexName: "primary_user_id-index",
      KeyConditionExpression: "#id = :userid",
      ExpressionAttributeNames: {
        "#id": "primary_user_id"
      },
      ExpressionAttributeValues: {
        ":userid": user.Items[0].user_id
      }
    };
    const credentialsResults = await documentClient.query(credentialsParams, function(err, data) {
    if (err) 
    {
        console.error("Unable to query login_credentials. Error:", JSON.stringify(err, null, 2));
        response = {
            statusCode: 200,
            body: JSON.stringify({
              statusCode: 400,
              message: "Error trying to search for the shared user credentials"
            })
          };
        return response;
    } 
    }).promise();
    
    // Check if the login_credentials retrieved match the one in the request
    var sharedAccountInfo = null;
    for (var i = 0; i<credentialsResults.Items.length; i++)
    {
      if (credentialsResults.Items[i].login_credentials_id == body.account)
        sharedAccountInfo = credentialsResults.Items[i];
    }
  
    // Return an error if the login_credentials don't match the one in the request
    if (sharedAccountInfo == null) 
    {
      console.log("Couldn't find the login credentials relating to the one found in the request");
      response = {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: 400,
          message: "Couldn't find the user you're trying to share to, please refresh and try again"
        })
      };
      return response;
    }
    
    // Get all the devices shared by the user
    var deviceParams = {
        TableName: "Shared_Device_Properties",
        IndexName: "login_credentials_id-index",
        KeyConditionExpression: "#id = :value",
        ExpressionAttributeNames: {
          "#id": "login_credentials_id"
        },
        ExpressionAttributeValues: {
          ":value": sharedAccountInfo.login_credentials_id
        }
    };
    const deviceResults = await documentClient.query(deviceParams, function(err, data) {
        if (err) 
        {
            console.error("Unable to query shared_device_properties. Error:", JSON.stringify(err, null, 2));
            console.log("Couldn't find the login credentials relating to the one found in the request");
            response = {
              statusCode: 200,
              body: JSON.stringify({
                statusCode: 400,
                message: "Error while searching your shared devices, please refresh and try again"
              })
            };
            return response;
        } 
    }).promise();
    
    // Check if the devices retrieved match the one in the request
    var device = null;
    for(i = 0; i<deviceResults.Items.length; i++)
    {
        if (deviceResults.Items[i].shared_device_properties_id == body.device)
            device = deviceResults.Items[i];
    }
    
    if (device == null) 
    {
        console.log("Couldn't find the device in the request");
        response = {
          statusCode: 200,
          body: JSON.stringify({
            statusCode: 400,
            message: "Error while searching for the specified device, please refresh and try again"
          })
        };
        return response;
    }
    
    
  
    // Create the new entry into the shared_property table
    const propertyParams = {
    TableName: "Shared_Property",
        Item: {
          shared_property_id: event.requestContext.requestId,
          shared_device_properties_id: device.shared_device_properties_id,
          name: body.name,
          type: body.type,
          path: body.path,
          read_only: body.read_only,
          unrestricted: body.unrestricted,
          temporary: body.temporary,
          temp_time_range_start: body.temp_time_range_start,
          temp_time_range_end: body.temp_time_range_end,
          temp_date: body.temp_date,
          time_range: body.time_range,
          time_range_start: body.time_range_start,
          time_range_end: body.time_range_end,
          time_range_reoccuring: body.time_range_reoccuring,
          time_range_start_date: body.time_range_start_date,
          time_range_end_date: body.time_range_end_date,
          gps_location: body.gps_location,
          gps_location_distance: body.gps_location_distance,
        }
    };
    
    // Log the interaction in the credentials_log
    var dateTime = new Date;
    const logParams = {
      TableName: "Credentials_Log",
      Item: {
        credentials_log_id: context.awsRequestId,
        primary_user_id: user.Items[0].user_id,
        secondary_user_id: sharedAccountInfo.secondary_user_id,
        guest_email: sharedAccountInfo.guest_email,
        guest_password: sharedAccountInfo.guest_password,
        operation: "New access rules given for " + device.name + " by " + user.Items[0].name,
        date: dateTime.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
        time: dateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
      }
    };
  
  console.log("Creating Log");
  await documentClient.put(logParams, function(err, data) {
    if (err) 
    {
      console.error(":( Error:", JSON.stringify(err, null, 2));
      response = {
        statusCode: 400,
        body: JSON.stringify({
          statusCode: 400,
          message: "Error occured while searching for user"
        })
      };
      return response;
    } 
  }).promise();
  console.log("Created log");
    
    try 
    {
      await documentClient.put(propertyParams).promise();
      response = {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: 200,
          message: "Shared a property successfully!"
        })
      };
      return response;
    } 
    
    catch (err) 
    {
    console.log(err);
    response = {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: 400,
          message: "Error adding the property to the database"
        })
      };
      return response;
    }
  
};