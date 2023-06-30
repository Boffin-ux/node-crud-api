import dotenv from 'dotenv';
import { DEFAULT_PORT } from './constants';
import { ServerApp } from './server';

dotenv.config();
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

const server = new ServerApp(PORT);
server.runServer();
