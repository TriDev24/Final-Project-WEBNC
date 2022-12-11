import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import apiRouters from './routers/index.js';
import { bootstrapDatabase } from './configs/database.config.js';
import dotenv from 'dotenv';

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
app.use(logger('dev'));

const apiVersion = 'v1.0.0';

app.use(`/${apiVersion}`, apiRouters);

// Sync
app.listen(port, async () => {
    try {
        await bootstrapDatabase();

        console.log('Database sync');
        console.log(`Server running on port ${port} ...`);
    } catch (error) {
        console.log('Error: ', error);
    }
});
