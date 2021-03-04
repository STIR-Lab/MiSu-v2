'use strict';
const https = require('https');
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  const body = JSON.parse(event.body);
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
                statusCode: 200, 
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
        IndexName: "secondary_user_id-index",
        KeyConditionExpression: "#id = :userid",
        ExpressionAttributeNames: {
          "#id": "secondary_user_id"
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
                statusCode: 200, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Couldn't find the account credentials for the hub you are trying to access, please refresh"
                })
            };
            return response;
        } 
    }).promise();
    
    var login_credentials = null;
    for (var i = 0; i<credentialsResults.Items.length; i++)
    {
        if (credentialsResults.Items[i].login_credentials_id == body.account)
            login_credentials = credentialsResults.Items[i];
    }
    
    if (login_credentials == null) 
    {
        console.log("Couldn't find the login_credentials relating to this entry");
        response = {
            statusCode: 200, 
            body: JSON.stringify({
                statusCode: 400,
                message: "Couldn't find the information to the account shared to you, please refresh"
            })
        };
        return response;
    }
    
    // Find out who is sharing to us
    var primaryUserParams = {
        TableName: "User",
        KeyConditionExpression: "#id = :userid",
        ExpressionAttributeNames: {
          "#id": "user_id"
        },
        ExpressionAttributeValues: {
          ":userid": login_credentials.primary_user_id
        }
    };
    
    const primaryUser = await documentClient.query(primaryUserParams, function(err, data) {
        if (err) 
        {
            console.log("Unable to query the user table, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 200, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Couldn't find the information to the account who shared to you, please refresh"
                })
            };
            return response;
        } 
    }).promise();
    
    var deviceParams = {
        TableName: "Shared_Device_Properties",
        IndexName: "login_credentials_id-index",
        KeyConditionExpression: "#id = :sharerId",
        ExpressionAttributeNames: {
          "#id": "login_credentials_id"
        },
        ExpressionAttributeValues: {
          ":sharerId": login_credentials.login_credentials_id
        }
    };
    
    const deviceResults = await documentClient.query(deviceParams, function(err, data) {
        if (err) 
        {
            console.log("Unable to query the shared_device_properties table, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 200, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Couldn't find the device information, please refresh"
                })
            };
            return response;
        } 
    }).promise();
    
    var device = null;
    for( i = 0; i<deviceResults.Items.length; i++)
    {
        if (deviceResults.Items[i].shared_device_properties_id == body.device)
            device = deviceResults.Items[i];
    }
    
    if (device == null) 
    {
        console.log("Couldn't find the device relating to this entry");
        response = {
            statusCode: 200, 
            body: JSON.stringify({
                statusCode: 400,
                message: "Couldn't find the information to the device shared to you, please refresh"
            })
        };
        return response;
    }
    
    var propertyParams = {
        TableName: "Shared_Property",
        IndexName: "shared_device_properties_id-index",
        KeyConditionExpression: "#id = :deviceId",
        ExpressionAttributeNames: {
          "#id": "shared_device_properties_id"
        },
        ExpressionAttributeValues: {
          ":deviceId": device.shared_device_properties_id
        }
    };

    const propertyResults = await documentClient.query(propertyParams, function(err, data) {
        if (err) 
        {
            console.log("Unable to query the shared_property table, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 200, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Couldn't find the information to the property shared to you, please refresh"
                })
            };
            return response;
        } 
    }).promise();
        
    var property = null;
    for(i = 0; i<propertyResults.Items.length; i++)
    {   
        if (propertyResults.Items[i].shared_property_id == body.property)
            property = propertyResults.Items[i];
    }
    
    if (property == null) 
    {
        console.log("Couldn't find the property relating to this entry");
        response = {
            statusCode: 200, 
            body: JSON.stringify({
                statusCode: 400,
                message: "Couldn't find the information to the property shared to you, please refresh"
            })
        };
        return response;
    }
    
    // Get the user's email and password 
    var postData = JSON.stringify({
        'email' : login_credentials.guest_email,
        'password': login_credentials.guest_password
    });
    
    var options = {
        host: primaryUser.Items[0].hub_url,
        path: '/login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
        
    const token = await getLoginToken(options, postData);
    
    let options1 = {
        host: primaryUser.Items[0].hub_url,
        path: property.path,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token.jwt
        }
    };
    
    const values = await getValues(options1);
    response = {
        statusCode: 200, 
        body: JSON.stringify({
            statusCode: 200,
            message: values
        })
    };
    return response;
    
           
    function getLoginToken(options, postData)
    {
        return new Promise(((resolve, reject) => {
                
            const req =  https.request(options, function(res) {
            res.setEncoding('utf8');
            let dataString = '';
            
            res.on('data', chunk => {
                dataString += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse((dataString)));
            });
            
        });
        
        req.on('error', (e) => {
            console.error(e);
        });
        
        req.write(postData);
        req.end();
        
    }));
    }

    function getValues(options)
    {
        return new Promise(((resolve, reject) => {
                
            const req = https.get(options, function(res) {
                res.setEncoding('utf8');
                let dataString = '';
                
                res.on('data', chunk => {
                    dataString += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse((dataString)));
                });
                
            });
            
            req.on('error', (e) => {
                console.error(e);
            });
            
            req.end();
            
        }));
    }
};

  
