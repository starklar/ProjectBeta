# ProjectBeta
 Mock shopping website with a React JavaScript front end and to connect to an AWS backend.

 Backend uses:
 - AWS Cognito for user registration, sign-in, and authentication with JWT tokens
 - AWS Gateway to handle HTTP requests and responses along with authentication of incoming requests
 - AWS Lambda to handle the HTTP response logic and interact with Dynamo databases
 - AWS Dynamodb to hold some user cart data and product data

# To run:
 Use 'npm start' and then navigate to http://localhost:3000 to begin.

# NOTE:
 Files in lambda_functions folder are originally index.mjs files for their corresponding Lambda function
