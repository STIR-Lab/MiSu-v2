'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
    var response; 
    
    // Identify the user making the request
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
    
    // console.log("%j", "user", user.Items[0]);
    // Find out who we are sharing to
    var logParams = {
        TableName: "Property_Log",
        IndexName: "primary_user_id-index",
        KeyConditionExpression: "#id = :value",
        ExpressionAttributeNames: {
          "#id": "primary_user_id"
        },
        ExpressionAttributeValues: {
          ":value": user.Items[0].user_id
        }
    };
    const logs = await documentClient.query(logParams, function(err, data) {
        if (err) 
        {
            console.log("Unable to query the property_log table, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 200, 
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Couldn't find the information to the account you're sharing to"
                })
            };
            return response;
        } 
    }).promise();
    
    var results = [];
    var secondary = {};
    for(var i = 0; i<logs.Items.length; i++)
    {
        // console.log(logs.Items[i].property_log_id);
        if (secondary.user_id !== logs.Items[i].secondary_user_id)
        {
            // Find out who used the device
            var secondaryParams = {
                TableName: "User",
                KeyConditionExpression: "#id = :userid",
                ExpressionAttributeNames: {
                  "#id": "user_id"
                },
                ExpressionAttributeValues: {
                  ":userid": logs.Items[i].secondary_user_id
                }
            };
            const secondaryUser = await documentClient.query(secondaryParams, function(err, data) {
                if (err) 
                {
                    console.log("Unable to query the user table, error:", JSON.stringify(err, null, 2));
                    response = {
                        statusCode: 200, 
                        body: JSON.stringify({
                            statusCode: 400,
                            message: "Couldn't find the information to the account who used your device"
                        })
                    };
                    return response;
                } 
            }).promise();
            secondary = secondaryUser.Items[0];
        }
        
        var log = {};
        log.device_description = logs.Items[i].device_description;
        log.device_name = logs.Items[i].device_name;
        log.secondary_user = secondary.name;
        log.property_name = logs.Items[i].property_name;
        log.guest_email = logs.Items[i].guest_email;
        log.time = logs.Items[i].time;
        log.date = logs.Items[i].date;
        
        log.value = logs.Items[i].value;
        results.push(log);
    }
    
    response = {
        statusCode: 200, 
        body: JSON.stringify({
            statusCode: 200,
            message: results
        })
    };
    return response;
};