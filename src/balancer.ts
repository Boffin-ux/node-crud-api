import cluster from 'cluster';
import { createServer, request } from 'http';
import { availableParallelism } from 'os';
import { ServerApp } from './server';
import { HOST } from './constants';
cluster.schedulingPolicy = cluster.SCHED_RR;

export class Balancer {
  private port: number;
  private currentWorker: number;
  private cpus: number;

  constructor(port: number) {
    this.port = port;
    this.currentWorker = 0;
    this.cpus = availableParallelism();
  }

  runBalancer() {
    if (cluster.isPrimary) {
      this.cluster();
    } else {
      this.worker();
    }
  }

  private _createServer() {
    return createServer((req, res) => {
      req.pipe(
        request(
          {
            host: HOST,
            path: req.url,
            method: req.method,
            headers: req.headers,
            port: this.port + this.currentWorker,
          },
          (workerResp) => {
            if (workerResp.statusCode) {
              res.statusCode = workerResp.statusCode;
            }
            workerResp.pipe(res);
          },
        ),
      );
      this.currentWorker =
        this.currentWorker !== this.cpus - 1 ? this.currentWorker + 1 : 0;
    }).listen(this.port, () =>
      console.log(`Primary process ${process.pid} listen:${this.port}`),
    );
  }

  private cluster() {
    for (let i = 1; i < this.cpus; i++) {
      cluster.fork({ WORKER_PORT: this.port + i });
    }

    cluster.on('message', (worker, data) => {
      for (const id in cluster.workers) {
        cluster.workers[id]?.send({ data });
      }
    });

    this._createServer();

    cluster.on('exit', (worker, code) => {
      console.log(`Worker died! Pid: ${worker.process.pid} Code: ${code}`);
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        cluster.fork({ WORKER_PORT: this.port + worker.id });
      }
    });
  }

  private worker() {
    const WORKER_PORT = Number(process.env.WORKER_PORT);
    const server = new ServerApp(WORKER_PORT);
    server.runServer('Worker');
  }
}
