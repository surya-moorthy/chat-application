import express from "express";
import {createServer} from "node:http";
import cors from "cors";
import dotenv from "dotenv";
import { routes } from "./http/routes/routes";
import { WebSocketServer } from "ws";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const server = createServer(app);
export const wss = new WebSocketServer({server});

app.use("/api/v1",routes)

server.listen(4000,()=>{
  console.log("server is running at server of port 4000");
})
