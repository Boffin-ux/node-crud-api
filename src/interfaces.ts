import { IncomingMessage, ServerResponse } from 'http';

interface IServerApp {
  runServer(): void;
}

interface IError extends Error {
  code?: string;
}

interface IUserData {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface IRouter {
  getRoute(req: IncomingMessage, res: ServerResponse): Promise<void>;
}

interface IResponseData {
  res: ServerResponse;
  code: number;
  message?: string;
  data?: IUserData[] | IUserData;
}

export { IServerApp, IError, IUserData, IRouter, IResponseData };
