import http from "http";
import express from "express";
import { Server } from "colyseus";

import { PongRoom } from "./PongRoom";

const port = Number(process.env.PORT || 2567);
const app = express();

app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

// register your room handlers
gameServer.define('pong', PongRoom);

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`)
