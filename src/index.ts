import dotenv from 'dotenv';
import { DEFAULT_PORT } from './constants';
import { ServerApp } from './server';
import { Balancer } from './balancer';

dotenv.config();
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

if (process.argv[2] === '--multi') {
  const balancer = new Balancer(PORT);
  balancer.runBalancer();
} else {
  const server = new ServerApp(PORT);
  server.runServer();
}
