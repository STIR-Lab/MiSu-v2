'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  const body = JSON.parse(event.body);
  var response;
  const url = body.hub_url.replace(/(^\w+:|^)\/\//, '');
  
    var params = {
        TableName: "User",
        Key:{
            "user_id":  event.requestContext.authorizer.claims.sub,
        },
        UpdateExpression: "SET hub_url = :url, hub_email = :email, hub_password = :pass, user_type =:type",
        ExpressionAttributeValues:{
            ":url": url,
            ":email": body.hub_email,
            ":pass": body.hub_password,
            ":type": 1
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    try 
    {
        await documentClient.update(params).promise();
        response = {
            statusCode: 200,
            body: JSON.stringify({
                statusCode: 200,
                messsage: "Updated hub information successfully"
            })
        };
        return response;
    } catch (e) 
    {
        console.log("Unable to update item. Error JSON:", JSON.stringify(e, null, 2));
        response = {
            statusCode: 200,
            body: JSON.stringify({
                statusCode: 200,
                messsage: "Error occured while updating hub information"
            })
        };
        return response;
    }
};