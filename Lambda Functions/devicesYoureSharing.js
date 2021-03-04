'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
    var response; 
    var params = {
        TableName: "User",
        KeyConditionExpression: "#id = :userid",
        ExpressionAttributeNames: {
          "#id": "user_id"
        },
        ExpressionAttributeValues: {
          ":userid": event.requestContext.authorizer.claims.sub
        }
    };
  
    const user = await documentClient.query(params, function(err, data) {
        if (err) 
        {
            console.log("Unable to query user table, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 400, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Error occured during user search"
                })
            };
            return response;
        } 
    }).promise();
    
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
            console.log("Unable to query login_credentials table, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 400, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Couldn't find the account credentials for the hub you are trying to access, please refresh"
                })
            };
            return response;
        } 
    }).promise();
    
    var list = [];
    for(var i = 0; i<credentialsResults.Items.length; i++)
    {
        // Find out who we are sharing to
        var secondaryParams = {
            TableName: "User",
            KeyConditionExpression: "#id = :userid",
            ExpressionAttributeNames: {
              "#id": "user_id"
            },
            ExpressionAttributeValues: {
              ":userid": credentialsResults.Items[i].secondary_user_id
            }
        };
      
        const secondaryUser = await documentClient.query(secondaryParams, function(err, data) {
            if (err) 
            {
                console.log("Unable to query the user table, error:", JSON.stringify(err, null, 2));
                response = {
                    statusCode: 400, 
                    body: JSON.stringify({
                        statusCode: 400,
                        message: "Couldn't find the information to the account you're sharing to"
                    })
                };
                return response;
            } 
        }).promise();
        
        console.log("%j", null, secondaryUser);
        
        var tempList = {};
        tempList.login_credentials_id = credentialsResults.Items[i].login_credentials_id;
        tempList.name = secondaryUser.Items[0].name;
        tempList.guest_email = secondaryUser.Items[0].email;
        tempList.accepted = credentialsResults.Items[i].accepted;
        
        var deviceParams = {
            TableName: "Shared_Device_Properties",
            IndexName: "login_credentials_id-index",
            KeyConditionExpression: "#id = :sharerId",
            ExpressionAttributeNames: {
              "#id": "login_credentials_id"
            },
            ExpressionAttributeValues: {
              ":sharerId": credentialsResults.Items[i].login_credentials_id
            }
        };
        
        const deviceResults = await documentClient.query(deviceParams, function(err, data) {
            if (err) 
            {
                console.log("Unable to query the shared_device_properties table, error:", JSON.stringify(err, null, 2));
                response = {
                    statusCode: 400, 
                    body: JSON.stringify({
                        statusCode: 400,
                        message: "Couldn't find the device information, please refresh"
                    })
                };
                return response;
            } 
        }).promise();
        
        var devices = [];
        for(var j = 0; j<deviceResults.Items.length; j++)
        {
            devices.push(deviceResults.Items[j]);
            
            var propertyParams = {
                TableName: "Shared_Property",
                IndexName: "shared_device_properties_id-index",
                KeyConditionExpression: "#id = :deviceId",
                ExpressionAttributeNames: {
                  "#id": "shared_device_properties_id"
                },
                ExpressionAttributeValues: {
                  ":deviceId": deviceResults.Items[j].shared_device_properties_id
                }
            };
        
            const propertyResults = await documentClient.query(propertyParams, function(err, data) {
                if (err) 
                {
                    console.log("Unable to query the shared_property table, error:", JSON.stringify(err, null, 2));
                    response = {
                        statusCode: 400, 
                        body: JSON.stringify({
                            statusCode: 400,
                            message: "Couldn't find the information to the property shared to you, please refresh"
                        })
                    };
                    return response;
                } 
            }).promise();
            
            var properties = [];
            for(var k = 0; k<propertyResults.Items.length; k++)
            {
                properties.push(propertyResults.Items[k]);
            }
            devices[j].properties = properties;
        }
        tempList.devices = devices;
        list.push(tempList);
    }
    
    response = {
        statusCode: 200, 
        body: JSON.stringify({
            statusCode: 200,
            message: list
        })
    };
    return response;
};