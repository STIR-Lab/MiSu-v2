'use strict';
const https = require('https');
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  const body = JSON.parse(event.body);
  var response;
  
    // Identify the user
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
    
    // Get all of the login_credentials for the user
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
            console.log("Unable to query, error:", JSON.stringify(err, null, 2));
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
    
    // Check if the login_credentials retrieved match the one in the request
    var login_credentials = null;
    for (var i = 0; i<credentialsResults.Items.length; i++)
    {
        if (credentialsResults.Items[i].login_credentials_id == body.account)
            login_credentials = credentialsResults.Items[i];
    }
    
    // Return an error if the login_credentials don't match the one in the request
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
    
    // Check the invitation has been accepted by secondary user
    if (login_credentials.accepted === 0)
    {
        console.log("Trying to access a device without the invitation being accepted");
        response = {
            statusCode: 200, 
            body: JSON.stringify({
                statusCode: 400,
                message: "Please accept the invitiaton first before using a device"
            })
        };
        return response;
    }
    
    // Identify the primary user
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
    const primaryUsers = await documentClient.query(primaryUserParams, function(err, data) {
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
    
    var primaryUser = primaryUsers.Items[0];
    // for (var i = 0; i<primaryUsers.Items.length; i++)
    // {
        // if (primaryUsers.Items[i].user_id == body.account)
            // primaryUser = primaryUsers.Items[i];
    // }
    
     // Return an error if the primary user doesn't match the one in the request
    if (primaryUser == null) 
    {
        console.log("Couldn't find the primary user relating to this entry");
        response = {
            statusCode: 200, 
            body: JSON.stringify({
                statusCode: 400,
                message: "Couldn't find the information to the account shared who shared to you"
            })
        };
        return response;
    }
    
    // Identify the device to be used
    var deviceParams = {
        TableName: "Shared_Device_Properties",
        IndexName: "login_credentials_id-index",
        KeyConditionExpression: "#id = :value",
        ExpressionAttributeNames: {
          "#id": "login_credentials_id"
        },
        ExpressionAttributeValues: {
          ":value": login_credentials.login_credentials_id
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
    
    // Verify that the user has access to this device
    var device = null;
    for(i = 0; i<deviceResults.Items.length; i++)
    {
        if (deviceResults.Items[i].shared_device_properties_id == body.device)
            device = deviceResults.Items[i];
    }
    
    // Return an error if no device matches the one requested
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
    
    // Identify the property to be used
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
        
    // Verify that the user has access to this property
    var property = null;
    for(i = 0; i<propertyResults.Items.length; i++)
    {   
        if (propertyResults.Items[i].shared_property_id == body.property)
            property = propertyResults.Items[i];
    }
    
    // Return an error if no property matches the one requested
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
    
    // Verify the device is being accessed within the rule set
    var dateTime = new Date;
    // HH:MM
    var localTime = dateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'});
    // MM/DD/YY
    var date = dateTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit',timeZone: 'America/New_York'});
    // ddd
    var day = dateTime.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York'});
    
    if (!property.unrestricted)
    {   
        // Temporary based rule checks
        if (property.temporary)
        {   
            // Check if it is still the same day
            if (date > property.temp_date)
            {
                console.log("Temporary access for this property has already passed, today is:" + day + ", rule was for up to:", property.temp_date);
                response = {
                    statusCode: 200, 
                    body: JSON.stringify({
                        statusCode: 400,
                        message: "Temporary access for this device has expired"
                    })
                };
                return response;
            }
            // Check if within the time rules
            else
            {   
                if (localTime < property.temp_time_range_start)
                {
                    console.log("Time window was not met, too early, current time: " + localTime + ", time rules:" + property.temp_time_range_start + "-" + property.temp_time_range_end);
                    response = {
                        statusCode: 200, 
                        body: JSON.stringify({
                            statusCode: 400,
                            message: "This device is not available at this time (Too early)"
                        })
                    };
                    return response;
                }
                else
                {
                    if (localTime > property.temp_time_range_end)
                    {   
                        console.log("Time window was not met, too late, current time: " + localTime + ", time rules:" + property.temp_time_range_start + "-" + property.temp_time_range_end);
                        response = {
                            statusCode: 200, 
                            body: JSON.stringify({
                                statusCode: 400,
                                message: "The time window for this device has expired (Too late)"
                            })
                        };
                        return response;
                    }
                }
            }
        }
        // Schedule based rule checks
        else if (property.time_range)
        {
            // Check if within the schedule start date
            if (date >= property.time_range_start_date)
            {   
                // Check if within the schedule end date
                if (date <= property.time_range_end_date)
                {
                    // Check if we are within the time range window
                    if (localTime >= property.time_range_start)
                    {
                        if (localTime <= property.time_range_end)
                        {   
                            // Check if this rule is operating on the correct day(s)
                            if (property.time_range_reoccuring !== null)
                            {
                                var withinTimeFrame = 0;
                                var daysReoccuring = property.time_range_reoccuring.match(/.{1,3}/g);
                                for (var i = 0; i <daysReoccuring.length; i++)
                                {
                                    if (day === daysReoccuring[i])
                                        withinTimeFrame = 1;
                                }
                                
                                if (!withinTimeFrame)
                                {
                                    console.log("Today was not one of the days listed within the rules, today is:" + day + ", days allowed are:", property.time_range_reoccuring);
                                    response = {
                                        statusCode: 200, 
                                        body: JSON.stringify({
                                            statusCode: 400,
                                            message: "Today is not a day in which you can use this device!"
                                        })
                                    };
                                    return response;
                                }
                            }
                        }
                        else
                        {
                            console.log("Time window was not met, too late, current time: " + localTime + ", time rules:" + property.time_range_start + "-" + property.time_range_end);
                            response = {
                                statusCode: 200, 
                                body: JSON.stringify({
                                    statusCode: 400,
                                    message: "This device is not available at this time (Too late)"
                                })
                            };
                            return response;
                        }
                        
                    }
                    else
                    {
                        console.log("Time window was not met, too early, current time: " + localTime + ", time rules:" + property.time_range_start + "-" + property.time_range_end);
                        response = {
                            statusCode: 200, 
                            body: JSON.stringify({
                                statusCode: 400,
                                message: "This device is not available at this time (Too early)"
                            })
                        };
                        return response;
                    }
                }
                else
                {
                    console.log("Attempting to use a device after the schedule has ended");
                    response = {
                        statusCode: 200, 
                        body: JSON.stringify({
                            statusCode: 400,
                            message: "Access to this device has expired (Schedule has ended)"
                        })
                    };
                    return response;
                }
            }
            else
            {
                console.log("Attempting to use a device before the schedule has started");
                response = {
                    statusCode: 200, 
                    body: JSON.stringify({
                        statusCode: 400,
                        message: "This device is not available at this date (Schedule hasn't started yet)"
                    })
                };
                return response;
            }
        }
    }
    
    console.log("Logging in" + primaryUser.hub_url + " with " + login_credentials.guest_email + " " +  login_credentials.guest_password);
    // Login to the hub and retrieve JWT
    var loginRequest = {
        host: primaryUser.hub_url,
        path: '/login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var postData = JSON.stringify({
        'email' : login_credentials.guest_email,
        'password': login_credentials.guest_password
    });
    const token = await getLoginToken(loginRequest, postData);
    console.log("Login Token: " + token.jwt);
    
    // Create the correct http depending on the device
    var activateDeviceRequest;
    var propPath = property.path;
    var propertyName = propPath.substring(propPath.lastIndexOf("/") + 1, propPath.length);
    var postData1 = {};
    var lower = body.value;
    // Check if the property is speak which is unique to the google home mini speak action
    if (property.name === "speak")
    {
        activateDeviceRequest = {
            host: primaryUser.hub_url,
            path: property.path,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.jwt
            }
        };
        postData1[lower.toLowerCase()] = {input: {language: "en", text: "That was easy", volume: 20}};
        postData1 = JSON.stringify(postData1);
        console.log(postData1);
    }
    // Check if the property is actually an action, in which case the request is a post with general formatting for lock actions
    else if (property.type === "action")
    {
        activateDeviceRequest = {
            host: primaryUser.hub_url,
            path: property.path,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.jwt
            }
        };
        postData1[lower.toLowerCase()] = {"input":{}};
        postData1 = JSON.stringify(postData1);
        console.log(postData1);
    }
    // If the property is actually a property and not an action, format the request as a put
    else
    {
        activateDeviceRequest = {
            host: primaryUser.hub_url,
            path: property.path,
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.jwt
            }
        };
        console.log("%j", "Request", activateDeviceRequest);
        postData1[propertyName] = body.value;
        postData1 = JSON.stringify(postData1);
    }
    console.log("%j", "postdata", postData1);
    await getValues(activateDeviceRequest, postData1);
    
    // Log the interation in the property_log
    const logParams = {
        TableName: "Property_Log",
        Item: {
          property_log_id: context.awsRequestId,
          value: body.value,
          primary_user_id: primaryUser.user_id,
          secondary_user_id: user.Items[0].user_id,
          guest_email: login_credentials.guest_email,
          guest_password: login_credentials.guest_password,
          device_name: device.name,
          device_description: device.description,
          property_name: property.name,
          property_type: property.description,
          property_path: property.path,
          property_read_only: property.read_only,
          property_unrestricted: property.unrestricted,
          property_temporary: property.temporary,
          property_temp_time_range_start: property.temp_time_range_start,
          property_temp_time_range_end: property.temp_time_range_end,
          property_temp_date: property.temp_date,
          property_time_range: property.time_range,
          property_time_range_start: property.time_range_start,
          property_time_range_end: property.time_range_end,
          property_time_range_reoccuring: property.time_range_reoccuring,
          property_time_range_start_date: property.time_range_start_date,
          property_time_range_end_date: property.time_range_end_date,
          property_gps_location: property.gps_location,
          property_gps_location_distance: property.gps_location_distance,
          date: dateTime.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
          time: dateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
        }
    };
    await documentClient.put(logParams).promise();
    
    response = {
        statusCode: 200, 
        body: JSON.stringify({
            statusCode: 200,
            message: "Device activated"
        })
    };
    return response;
    
    function getLoginToken(options, postData)
    {
        return new Promise(((resolve, reject) => {
                
            const req =  https.request(options, function(res) {
            res.setEncoding('utf8');
            var dataString = '';
            
            res.on('data', chunk => {
                dataString += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse((dataString)));
            });
            
        });
        
        req.on('error', (e) => {
            console.log(e);
        });
        
        req.write(postData);
        req.end();
        
    }));
    }

    function getValues(options1, postData1)
    {
        return new Promise(((resolve, reject) => {
                
            const req = https.request(options1, function(res) {
                res.setEncoding('utf8');
                var dataString = '';
                
                res.on('data', chunk => {
                    dataString += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse((dataString)));
                });
            });
            
            req.on('error', (e) => {
                console.log(e);
            });
            
            req.write(postData1);
            req.end();
        }));
    }
};

  
