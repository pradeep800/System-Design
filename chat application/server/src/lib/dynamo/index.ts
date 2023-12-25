import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import AWS from "aws-sdk";
AWS.config.update({ region: "ap-south-1" });
const client = new AWS.DynamoDB({ region: "ap-south-1" });
export const dynamodbClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY as string,
    secretAccessKey: process.env.SECRET_KEY as string,
  },
});

export const tableName = "chat-db";
var params = {
  AttributeDefinitions: [
    {
      AttributeName: "PK",
      AttributeType: "S",
    },
    {
      AttributeName: "SK",
      AttributeType: "S",
    }, //
  ],
  KeySchema: [
    {
      AttributeName: "PK",
      KeyType: "HASH",
    },
    {
      AttributeName: "SK",
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: tableName,
  StreamSpecification: {
    StreamEnabled: false,
  },
};

// client.createTable(params, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Table Created", data);
//   }
// });
