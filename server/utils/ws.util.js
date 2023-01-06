import WebSocket, { WebSocketServer } from 'ws';

export const WS_PORT = 40567;
export const socketServer = new WebSocketServer({
    port: WS_PORT,
});

export const broadCast = (accountNumber) => {
    for (let c of socketServer.clients) {
        if (c.readyState === WebSocket.OPEN) {
            c.send(accountNumber);
        }
    }
};
