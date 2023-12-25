import { Redis } from "ioredis";

let pub: Redis;
let sub: Redis;
if (process.env.ENV === "PROD") {
  pub = new Redis({
    host: process.env.REDIS_HOST as string,
    port: parseInt(process.env.REDIS_PORT as string),
  });
  sub = new Redis({
    host: process.env.REDIS_HOST as string,
    port: parseInt(process.env.REDIS_PORT as string),
  });
} else {
  pub = new Redis(process.env.REDIS_URL_PROD as string);
  sub = new Redis(process.env.REDIS_URL_PROD as string);
}
export { pub, sub };
