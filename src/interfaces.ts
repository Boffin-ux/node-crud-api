interface IServerApp {
  runServer(): void;
  close(): void;
}

interface IError extends Error {
  code?: string;
}

export { IServerApp, IError };
