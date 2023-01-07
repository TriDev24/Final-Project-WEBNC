import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './utils/database.util.js';
import routers from './routers/index.js';
import { socketServer, createServer } from './utils/ws.util.js';
import swaggerUI from 'swagger-ui-express';
import docs from './swagger-docs/index.js';
import http from 'http'

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    })
);

app.use('/api', routers);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

createServer(server)
server.on('request', app)

server.listen(port, async () => {
    try {
        await db();
        console.log(`Server running on port ${port} ...`);
        console.log(`WebSocket Server is running at ws://localhost:${port}`);
        socketServer.on('connection', function (client) {
            console.log('Client connects successfully.');
        });
    } catch (error) {
        console.log('Error: ', error);
    }
});
