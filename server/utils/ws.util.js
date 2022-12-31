import WebSocket, { WebSocketServer } from "ws";

const WS_PORT = 40567;
const socketServer = new WebSocketServer({
  port: WS_PORT,
});

socketServer.on("connection", function (client) {
  console.log("Client connects successfully.");
});

console.log(`WebSocket Server is running at ws://localhost:${WS_PORT}`);

export function broadCast(accountNumber) {
  for (let c of socketServer.clients) {
    if (c.readyState === WebSocket.OPEN) {
      c.send(accountNumber);
    }
  }
}

export default socketServer;
