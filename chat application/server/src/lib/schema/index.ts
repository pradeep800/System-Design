import { Entity } from "electrodb";
import KSUID from "ksuid";
import { v4 as uuidv4 } from "uuid";
export const User = new Entity({
  model: {
    entity: "Users",
    version: "1",
    service: "chat-db",
  },
  attributes: {
    name: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  indexes: {
    info: {
      pk: {
        field: "PK",
        composite: ["name"],
        template: "USER#${name}",
      },
      sk: {
        field: "SK",
        composite: ["name"],
        template: "USER#${name}",
      },
    },
  },
});
export const Messages = new Entity({
  model: {
    entity: "Messages",
    version: "1",
    service: "chat-db",
  },
  attributes: {
    sendByName: {
      type: "string",
      required: true,
    },
    ramdom: {
      type: "string",
      required: true,
      default: () => {
        const random = uuidv4();
        return random;
      },
    },
    content: {
      type: "string",
      required: true,
    },
    createdAt: {
      type: "number",
      default: () => Date.now(),
    },
  },
  indexes: {
    messages: {
      pk: {
        field: "PK",
        composite: ["sendByName"],
        template: "USER#${sendByName}",
      },
      sk: {
        field: "SK",
        composite: ["ramdom"],
        template: "USER#${ramdom}",
      },
    },
  },
});
