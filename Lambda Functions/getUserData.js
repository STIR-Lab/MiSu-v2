'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  
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
  
  try{
    await documentClient.query(params, function(err, data) {
      if (err) 
      {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        let response = 
        {
          statusCode: 400,
          body: JSON.stringify({
            statusCode: 400,
            message: err.message}),
        };
            
        return response;
      } 
      else 
      {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.name + ": " + item.email);
        });
        
        var response = 
        {
          "statusCode": 200,
          "body": JSON.stringify(data.Items[0]),
        };
        
        callback(null, response);
      }
    }).promise();
  }
  catch(err)
  {
    let response = 
    {
      statusCode: 400,
      body: JSON.stringify({
        statusCode: 400,
        message: "Error occured while fetching your user information"
      })
    };
    return response;
  }
  
};

  
