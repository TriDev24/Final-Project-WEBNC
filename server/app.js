import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './utils/index.js';
import routers from './routers/index.js';
import socketServer from './utils/ws.util.js'

dotenv.config();

const app = express();
const port = 8080;

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

app.listen(port, async () => {
    try {
        await db();
        console.log(`Server running on port ${port} ...`);
    } catch (error) {
        console.log('Error: ', error);
    }
});
