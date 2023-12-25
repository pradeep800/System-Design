import { Service } from "electrodb";
import { dynamodbClient, tableName } from "../dynamo/index";
import { Messages, User } from "./index";
export const ChatApp = new Service(
  {
    userInfo: User,
    messages: Messages,
  },
  { client: dynamodbClient, table: tableName }
);
