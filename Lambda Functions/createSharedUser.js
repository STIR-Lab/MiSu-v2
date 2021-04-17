'use strict';
const https = require('https');
const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({ region: "us-east-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
    const pass = uuid.v4();
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
                  statusCode: 400,
                  message: "Couldn't query for the user making the request"
              })
          };
          return response;
        } 
      }).promise();
      console.log("%j", "Homeowner", user.Items[0]);
      
      // Verify the secondary user exists
      const secondaryUserParams = 
      {
          TableName: "User",
          IndexName: "email-index",
          KeyConditionExpression: "#email = :input",
          ExpressionAttributeNames: {
            "#email": "email"
          },
          ExpressionAttributeValues: {
            ":input": body.email
          }
      };
      const secondaryUser = await documentClient.query(secondaryUserParams, function(err, data) {
        if (err) 
        {
          console.error("Unable to query for secondary user. Error:", JSON.stringify(err, null, 2));
          response = {
            statusCode: 400, 
            body: JSON.stringify({
                statusCode: 400,
                message: "Could not query for secondary user"
            })
          };
          return response;
        }
      }).promise();
      if (secondaryUser.Items.length == 0)
      {
        response = {
          statusCode: 400, 
          body: JSON.stringify({
              statusCode: 400,
              message: "Secondary user account could not be found"
          })
        };
        return response;
      }
      
      // Login to the hub and retrieve JWT
      var loginRequest = {
        host: user.Items[0].hub_url,
        path: '/login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
      };
      var postDataLogin = JSON.stringify({
        'email' : user.Items[0].hub_email,
        'password': user.Items[0].hub_password
      });
      const token = await getLoginToken(loginRequest, postDataLogin);
      console.log("Hub Token", token.jwt);
      
      // Create the new guest account for the secondary user
      let createUserRequest = {
        host: user.Items[0].hub_url,
        path: '/users/',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.jwt
        }
      };
      var postDataCreate = JSON.stringify({
        'email' : body.email,
        'password': pass,
        'name': secondaryUser.Items[0].name,
      });
      const createAccountResponse = await createAccount(createUserRequest, postDataCreate);
      // Verify that the account was created
      if (createAccountResponse.statusCode == 400)
      {
        console.log("Create account response code:", createAccountResponse.statusCode);
        response = {
          statusCode: 400, 
          body: JSON.stringify({
              statusCode: 400,
              message: "Error creating new shared user."
          })
        };
        return response;
      }
      console.log("Create account response code:", createAccountResponse.statusCode);
      
      // Create a new entry into login_credentials
      console.log("Creating new DB login_credentials entry...");
      const newSharedUser = {
        TableName: "Login_Credentials",
        Item: 
        {
          login_credentials_id: event.requestContext.requestId,
          guest_email: secondaryUser.Items[0].email,
          guest_password: pass,
          primary_user_id: event.requestContext.authorizer.claims.sub,
          secondary_user_id: secondaryUser.Items[0].user_id,
          accepted: 0
        }
      };
      await documentClient.put(newSharedUser, function(err, data) 
      {
        if (err) 
        {
          console.error("Unable to create new shared user. Error:", JSON.stringify(err, null, 2));
          response = {
            statusCode: 400, 
            body: JSON.stringify({
                statusCode: 400,
                message: "Error creating new shared user."
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
          primary_user_id: user.Items[0].user_id,
          secondary_user_id: secondaryUser.Items[0].user_id,
          guest_email: body.email,
          guest_password: pass,
          operation: "Create",
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
            message: event.requestContext.requestId
        })
      };
      return response;
      
    } 
    catch (err) 
    {
      console.log(err);
      response = {
        statusCode: 400, 
        body: JSON.stringify({
            statusCode: 400,
            message: "Error accessing this request" + err
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
    
    function createAccount(options, postData)
    {
      return new Promise(((resolve, reject) => {
        const req =  https.request(options, function(res) {
          res.setEncoding('utf8');
          let dataString = '';
          
          res.on('data', chunk => {
              dataString += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 400)
            {
              var response = {
                statusCode: 400, 
                body: JSON.stringify({
                  statusCode: 400,
                  message: "User already exists on gateway, please login to the gateway's website and remove the email of the user you are trying to share to"
                })
              };
              resolve(response);
            }
            else
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
};
    
