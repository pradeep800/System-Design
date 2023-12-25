import dotenv from "dotenv";
dotenv.config();
import { Server, Socket } from "socket.io";
import { ChatApp } from "./lib/schema/service";
import { pub, sub } from "./lib/redis/index";
import http from "http";
import express, { Request, Response } from "express";
const app = express();
import jwt from "jsonwebtoken";
const server = http.createServer(app);
const jwtsecret = "123456";
var corsOptions = {
  origin: ["http://127.0.0.1:5500"],
  optionsSuccessStatus: 200,
};
const io = new Server(server, { cors: { origin: corsOptions.origin } });
import cors from "cors";

const PORT = parseInt(process.env.PORT as string);
app.use(express.json());
app.use(cors(corsOptions));
app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    console.log("name", name);
    console.log("password", password);
    console.log("gmail, password or both are not present");
    return res.status(401).json({ msz: "Unauthorized" });
  }
  const token = jwt.sign({ name }, jwtsecret);
  const user = await ChatApp.entities.userInfo.get({ name }).go();
  if (user.data === null) {
    console.log("new user created");
    await ChatApp.entities.userInfo.create({ name, password }).go();
    return res.status(200).json({ token });
  } else {
    const realPassword = user.data.password;
    if (realPassword === password) {
      console.log("user login " + name);
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ msz: "Unauthorized" });
    }
  }
});
interface CustomSocket extends Socket {
  username?: string; // Define the username property in the custom type
}
io.use((socket: CustomSocket, next) => {
  const token = socket.handshake.auth.token as string | undefined;
  if (token) {
    const { name } = jwt.verify(token, jwtsecret) as { name: string };
    socket.username = name;
    next();
  } else {
    next(new Error("token not present"));
  }
});
io.on("connection", (socket: CustomSocket) => {
  console.log(socket.username, " connected");
  socket.on("message", (message) => {
    pub.publish(
      "message",
      JSON.stringify({ name: socket.username, message: message })
    );
  });
  socket.on("disconnect", (message) => {
    console.log(socket.username, " disconnected");
  });
});
sub.subscribe("message", (err, count) => {
  if (err) {
    console.log("failed to connect");
  } else {
    console.log("subscriber for message are ", count);
  }
});
sub.on("message", async (channel, message) => {
  //save in database

  const data = JSON.parse(message) as { name: string; message: string };
  await ChatApp.entities.messages
    .create({
      content: data.message,
      sendByName: data.name,
    })
    .go();

  io.emit("message", { ...data });
});
app.get(
  "/previousChats",
  (req, res, next) => {
    const token = req.headers.auth;
    if (!token) {
      res.status(402).json({ mez: "Unauthorized" });
    } else {
      jwt.verify(token as string, jwtsecret);
      next();
    }
  },
  async (req, res) => {
    const data = (await ChatApp.entities.messages.scan.go()).data;
    res.status(200).send(data);
  }
);
app.get("/check", (req: Request, res: Response) => {
  console.log(`Server socket port${PORT}`);
  res.status(200).json({ hello: "world" });
});
server.listen(PORT, "0.0.0.0", () => {
  console.log("listening " + PORT);
});

// const init = async () => {
//   const a = await pub.get("data");
//   console.log("first", a);
//   await pub.set("data", "hello");

//   const b = await pub.get("data");
//   console.log("second", b);
// };
// init();
