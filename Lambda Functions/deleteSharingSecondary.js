'use strict';
const https = require('https');
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
    const body = JSON.parse(event.body);
    var response;
    
    try 
    {
        // Get user hub login info
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
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                response = {
                    statusCode: 400, 
                    body: JSON.stringify({
                        statusCode: 200,
                        message: "Couldn't query for the user making the request"
                    })
                };
                return response;
            } 
        }).promise();
        
        // Retrieve all login_credentials shared to this account
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
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                response = {
                    statusCode: 200, 
                    body: JSON.stringify({
                        statusCode: 400,
                        message: "Couldn't query for the login credentials"
                    })
                };
                return response;
            } 
        }).promise();
        
        // Identify the account from the request
        var account = null;
        for (var i = 0; i<credentialsResults.Items.length; i++)
        {
            if (credentialsResults.Items[i].login_credentials_id === body.id)
                account = credentialsResults.Items[i];
        }
        
        // Verify the account to delete exists on the database
        if (account == null) 
        {
            console.log("Couldn't find the login_credentials info relating to this entry");
            response = {
                statusCode: 200, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Couldn't find the account to delete, please check your hub users and remove the user manually"
                })
            };
            return response;
        }
        
        // Retrieve hub credentials
        var primaryUserParams = {
            TableName: "User",
            KeyConditionExpression: "#id = :userid",
            ExpressionAttributeNames: {
              "#id": "user_id"
            },
            ExpressionAttributeValues: {
              ":userid": account.primary_user_id
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
                        message: "Couldn't find the information to the account shared to you, please refresh"
                    })
                };
                return response;
            } 
        }).promise();
        
        console.log("Attempting to login to the hub...");
        // Login to the hub, retrieve JWT
        var loginRequest = {
            host: primaryUser.Items[0].hub_url,
            path: '/login/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        var postData = JSON.stringify({
            'email' : primaryUser.Items[0].hub_email,
            'password': primaryUser.Items[0].hub_password
        });
        const token = await getLoginToken(loginRequest, postData);
        
        console.log("Login Successful...");
        console.log("Searching for account to delete...");
        // Fetch all accounts on the hub to find the id of the one to be deleted
        let getAccountsRequest = {
            host: primaryUser.Items[0].hub_url,
            path: '/users/info',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.jwt
            }
        };
        const accs = await getAccounts(getAccountsRequest);
        const id = accs.find(entry => entry.email === account.guest_email);
        console.log("Account found...");
        
        // Remove all devices and properties shared under this account
        // Retrieve all devices and properties
        var deviceParams = {
            TableName: "Shared_Device_Properties",
            IndexName: "login_credentials_id-index",
            KeyConditionExpression: "#id = :value",
            ExpressionAttributeNames: {
              "#id": "login_credentials_id"
            },
            ExpressionAttributeValues: {
              ":value": account.login_credentials_id
            }
        };
        const devices = await documentClient.query(deviceParams, function(err, data) {
            if (err) 
            {
                console.error("Unable to query for the devices shared under this account. Error:", JSON.stringify(err, null, 2));
                response = {
                    statusCode: 400, 
                    body: JSON.stringify({
                        statusCode: 400,
                        message: "Couldn't query the devices under this account"
                    })
                };
                return response;
            } 
        }).promise();
        for (var i = 0; i < devices.Items.length; i++)
        {   
            // Delete all properties per device
            var propertyParams = {
                TableName: "Shared_Property",
                IndexName: "shared_device_properties_id-index",
                KeyConditionExpression: "#id = :deviceId",
                ExpressionAttributeNames: {
                  "#id": "shared_device_properties_id"
                },
                ExpressionAttributeValues: {
                  ":deviceId": devices.Items[i].shared_device_properties_id
                }
            };
            const properties = await documentClient.query(propertyParams, function(err, data) {
                if (err) 
                {
                    console.error("Unable to query the shared properties under device " + devices.Items[i].shared_device_properties_id + ", Error:", JSON.stringify(err, null, 2));
                    response = {
                        statusCode: 200, 
                        body: JSON.stringify({
                            statusCode: 400,
                            message: "Unable to query the shared properties under device " + devices.Items[i].shared_device_properties_id
                        })
                    };
                    return response;
                } 
            }).promise();
            for (var j = 0; j < properties.Items.length; j++)
            {   
                // Delete the property
                var deletePropertyParams = {
                    TableName: "Shared_Property",
                    Key: {
                        "shared_property_id": properties.Items[j].shared_property_id
                    }
                };
                await documentClient.delete(deletePropertyParams, function(err, data) {
                    if (err) 
                    {
                        console.error("Unable to delete the shared properties under device " + devices.Items[i].shared_device_properties_id + ", Error:", JSON.stringify(err, null, 2));
                        response = {
                            statusCode: 200, 
                            body: JSON.stringify({
                                statusCode: 400,
                                message: "Unable to delete the shared properties under device " + devices.Items[i].shared_device_properties_id
                            })
                        };
                        return response;
                    } 
                }).promise();
            }
            // Delete the device
            var deleteDeviceParams = {
                TableName: "Shared_Device_Properties",
                Key: {
                    "shared_device_properties_id": devices.Items[i].shared_device_properties_id
                }
            };
            await documentClient.delete(deleteDeviceParams, function(err, data) {
                if (err) 
                {
                    console.error("Unable to delete the shared device, Error:", JSON.stringify(err, null, 2));
                    response = {
                        statusCode: 200, 
                        body: JSON.stringify({
                            statusCode: 400,
                            message: "Unable to delete the device " + devices.Items[i].shared_device_properties_id
                        })
                    };
                    return response;
                }
            }).promise();
        }
        
        // Delete the account from the hub + check if the account exists on the hub
        if (id !== undefined)
        {
            let deleteRequest = {
                host: primaryUser.Items[0].hub_url,
                path: '/users/' + id.id,
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.jwt
                }
            };
            await deleteAccount(deleteRequest);
        }
        
        console.log("Removing from database...");
        // Remove the login_credentials entry
        var credentialsParams2 = {
            TableName: "Login_Credentials",
            Key: {
              "login_credentials_id": account.login_credentials_id
            }
        };
        await documentClient.delete(credentialsParams2, function(err, data) {
            if (err) 
            {
                console.error("Unable to delete login_credentials entry" + account.login_credentials_id + ",Error:", JSON.stringify(err, null, 2));
                response = {
                    statusCode: 200, 
                    body: JSON.stringify({
                        statusCode: 400,
                        message: "Unable to delete login_credentials entry"
                    })
                };
                return response;
            } 
        }).promise();
        
        // Log the interaction in the credentials_log
        var dateTime = new Date;
        const logParams = {
        TableName: "Credentials_Log",
            Item: {
              credentials_log_id: context.awsRequestId,
              primary_user_id: primaryUser.Items[0].user_id,
              secondary_user_id: account.secondary_user_id,
              guest_email: account.guest_email,
              guest_password: account.guest_password,
              operation: "Ended sharing early",
              date: dateTime.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
              time: dateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
            }
        };
        await documentClient.put(logParams).promise();
        
        // Return response
        response = {
            statusCode: 200,
            body: JSON.stringify({ 
                statusCode: 200,
                message: 'Successfully ended sharing' 
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
                message: "Error accessing this request"
            })
        };
        return response;
    }
    
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
    
    function getAccounts(options, postData)
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
            
            req.end();
            
        }));
    }
    
    function deleteAccount(options)
    {
        return new Promise(((resolve, reject) => {
                
            const req =  https.request(options, function(res) {
                res.setEncoding('utf8');
                let dataString = '';
                
                res.on('data', chunk => {
                    dataString += chunk;
                });
                res.on('end', () => {
                    resolve(dataString);
                });
                
            });
            
            req.on('error', (e) => {
                console.error(e);
            });
            
            req.end();
            
        }));
    }
    
};
    
