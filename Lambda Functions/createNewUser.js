'use strict';
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  
  const params = {
    TableName: "User",
    IndexName: "email-index",
    KeyConditionExpression: "#email = :input",
    ExpressionAttributeNames: {
      "#email": "email"
    },
    ExpressionAttributeValues: {
      ":input": event.request.userAttributes.email
    }
  };
  
  const params1 = {
    TableName: "User",
    Item: {
      user_id: event.userName + "",
      email: event.request.userAttributes.email + "",
      name: event.request.userAttributes.name + "",
      address: event.request.userAttributes.address,
      phone: event.request.userAttributes.phone_number,
      city: event.request.userAttributes['custom:city'] + "",
      state: event.request.userAttributes['custom:state'] + "",
      hub_email: "",
      hub_password: "",
      hub_url: "",
      user_type: 0
    }
  };

  try 
  {
    const user = await documentClient.query(params).promise();
    // Check if the request is for a password reset, in which case, just check if the user exists
    if (event.triggerSource === "PostConfirmation_ConfirmForgotPassword")
    {
      if (user.Count == 0)
        context.done("User not found");
    }
    // Check if the request is for a new user sign up, in which case create a database entry if they don't have one already
    else
    {
      if (user.Count == 0)
        await documentClient.put(params1).promise();
      else
      {
        console.log("User already has a database entry in the user table");
        console.log(user);
        context.done("User already has a database entry in the user table", event);
      }
    }
  } 
  catch (err) 
  {
    console.log(err);
  }
  
  context.done(null, event);
};