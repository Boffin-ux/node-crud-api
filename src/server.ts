import { IncomingMessage, ServerResponse, createServer, Server } from 'http';
import { IError, IServerApp } from './interfaces';

export class ServerApp implements IServerApp {
  private port: number;
  private server: Server;

  constructor(port: number) {
    this.port = port;
    this.server = this._createServer();
  }

  private _createServer() {
    return createServer((req: IncomingMessage, res: ServerResponse) => {
      // todo
    });
  }

  runServer() {
    this.server.listen(this.port, () => {
      console.log(`Server process ${process.pid} listen:${this.port}`);
    });

    this.server.on('error', (err: IError) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`No access to port: ${this.port}`);
      } else {
        console.log(err.message);
      }
    });
  }

  close() {
    this.server.close();
  }
}
