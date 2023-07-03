import { IncomingMessage, ServerResponse, createServer, Server } from 'http';
import { IError, IServerApp } from './interfaces';
import { Router } from './router';

export class ServerApp implements IServerApp {
  private port: number;
  private server: Server;
  private router: Router;

  constructor(port: number) {
    this.port = port;
    this.server = this._createServer();
    this.router = new Router();
  }

  private _createServer() {
    return createServer((req: IncomingMessage, res: ServerResponse) => {
      this.router.getRoute(req, res);
    });
  }

  runServer(name = 'Server') {
    this.server.listen(this.port, () => {
      console.log(`${name} process ${process.pid} listen:${this.port}`);
    });

    this.server.on('error', (err: IError) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`No access to port: ${this.port}`);
      } else {
        console.log(err.message);
      }
    });
  }

  close(): void {
    this.server.close();
  }

  getServer(): Server {
    return this.server;
  }
}
