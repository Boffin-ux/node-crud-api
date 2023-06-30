interface IServerApp {
  runServer(): void;
  close(): void;
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

export { IServerApp, IError, IUserData };
