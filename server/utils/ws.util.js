import WebSocket, { WebSocketServer } from 'ws';

export var socketServer;

export function createServer(server){
    socketServer = new WebSocketServer({ server });
}

export const broadCast = (accountNumber) => {
    for (let c of socketServer.clients) {
        if (c.readyState === WebSocket.OPEN) {
            c.send(accountNumber);
        }
    }
};
