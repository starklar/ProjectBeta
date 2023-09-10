/**
 * Originally saved as index.mjs for the corresponding Lambda function.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "http-test-user-profiles";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET,POST,DELETE',
    "Access-Control-Allow-Headers": "*"
  };

  try {
    switch (event.routeKey) {
      case "DELETE /users/{username}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              username: event.pathParameters.username,
            },
          })
        );
        body = `Deleted user profile ${event.pathParameters.username}`;
        break;
      case "GET /users/{username}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              username: event.pathParameters.username,
            },
          })
        );
        body = body.Item;
        break;
      case "PATCH /users/{username}":
        const check = new GetCommand({
            TableName: tableName,
            Key: {
              username: event.pathParameters.username,
            },
        });
      
        const res = await dynamo.send(check);
        
        if(res.Item != null){
          let requestJSON = JSON.parse(event.body);
          
          body = await dynamo.send(
            new UpdateCommand({
              TableName: tableName,
              Key: {
                username : event.pathParameters.username
              },
              UpdateExpression: `set #cart = :cart`,
              ExpressionAttributeValues: {":cart": requestJSON.cart},
              ExpressionAttributeNames: {"#cart":"cart"}
            })
          );
          body = "Patch success";
        }
        else{
          throw new Error("Patch failed. User does not exist in database");
        }
        break;
      case "POST /users":
        let requestJSON = JSON.parse(event.body);
        
        const getCommand = new GetCommand({
            TableName: tableName,
            Key: {
              username: requestJSON.username,
            },
        });
      
        const response = await dynamo.send(getCommand);
        
        if(response.Item == null){
          await dynamo.send(
            new PutCommand({
              TableName: tableName,
              Item: {
                username: requestJSON.username,
                cart: requestJSON.cart
              },
            })
          );
          body = `Post user profile ${requestJSON.username}`;
        }
        else
        {
          body = response.Item;
        }
        
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};