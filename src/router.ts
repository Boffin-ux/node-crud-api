import { IncomingMessage, ServerResponse } from 'http';
import { DEFAULT_PATH, ResponseMessages, HttpStatus } from './constants';
import { IResponseData, IRouter, IUserData } from './interfaces';
import { UsersDb } from './model/usersDb';
import { v4, validate as isIdValid } from 'uuid';
import { validateUserData } from './validators';

export type THandler = (
  url: string,
  res: ServerResponse,
  req?: IncomingMessage,
) => Promise<void>;

export class Router implements IRouter {
  private endpoints: Record<string, THandler>;
  private usersDb: UsersDb;
  private userData: null | IUserData;

  constructor() {
    this.endpoints = {
      GET: <THandler>this.get.bind(this),
      POST: <THandler>this.post.bind(this),
      PUT: <THandler>this.put.bind(this),
      DELETE: <THandler>this.delete.bind(this),
    };
    this.usersDb = new UsersDb();
    this.userData = null;
  }

  private showResult(responseData: IResponseData): void {
    const { res, code, message, data } = responseData;
    const defaultResponse = { code, message };
    res.writeHead(code, { 'Content-type': 'application/json' });

    const result = data ? data : defaultResponse;
    res.end(JSON.stringify(result));
  }

  private get(id: string, res: ServerResponse): void {
    if (id) {
      if (isIdValid(id)) {
        try {
          const user = this.usersDb.getUser(id);
          return this.showResult({ res, code: HttpStatus.OK, data: user });
        } catch {
          return this.showResult({
            res,
            code: HttpStatus.NOT_FOUND,
            message: ResponseMessages.NOT_FOUND,
          });
        }
      }

      return this.showResult({
        res,
        code: HttpStatus.BAD_REQUEST,
        message: ResponseMessages.INVALID_ID,
      });
    }
    const users = this.usersDb.getUsers();
    return this.showResult({ res, code: HttpStatus.OK, data: users });
  }

  private post(id: string, res: ServerResponse): void {
    if (!this.userData) {
      return this.showResult({
        res,
        code: HttpStatus.BAD_REQUEST,
        message: ResponseMessages.BAD_REQUEST,
      });
    }

    if (!id) {
      if (!validateUserData(this.userData)) {
        return this.showResult({
          res,
          code: HttpStatus.BAD_REQUEST,
          message: ResponseMessages.INVALID_PARAMS,
        });
      }

      const user = { ...this.userData, id: v4() };
      const addUser = this.usersDb.createUser(user);
      return this.showResult({
        res,
        code: HttpStatus.CREATED,
        data: addUser,
      });
    }

    return this.showResult({
      res,
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_ENDPOINT,
    });
  }

  private delete(id: string, res: ServerResponse): void {
    if (id) {
      if (isIdValid(id)) {
        try {
          this.usersDb.deleteUser(id);

          return this.showResult({
            res,
            code: HttpStatus.NO_CONTENT,
          });
        } catch {
          return this.showResult({
            res,
            code: HttpStatus.NOT_FOUND,
            message: ResponseMessages.NOT_FOUND,
          });
        }
      }

      return this.showResult({
        res,
        code: HttpStatus.BAD_REQUEST,
        message: ResponseMessages.INVALID_ID,
      });
    }

    return this.showResult({
      res,
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_ENDPOINT,
    });
  }

  private put(id: string, res: ServerResponse): void {
    if (!this.userData) {
      return this.showResult({
        res,
        code: HttpStatus.BAD_REQUEST,
        message: ResponseMessages.BAD_REQUEST,
      });
    }

    if (id) {
      if (isIdValid(id)) {
        if (!validateUserData(this.userData)) {
          return this.showResult({
            res,
            code: HttpStatus.BAD_REQUEST,
            message: ResponseMessages.INVALID_PARAMS,
          });
        }

        try {
          const user = this.usersDb.updateUser(id, this.userData);

          return this.showResult({
            res,
            code: HttpStatus.OK,
            data: user,
          });
        } catch {
          return this.showResult({
            res,
            code: HttpStatus.NOT_FOUND,
            message: ResponseMessages.NOT_FOUND,
          });
        }
      }

      return this.showResult({
        res,
        code: HttpStatus.BAD_REQUEST,
        message: ResponseMessages.INVALID_ID,
      });
    }

    return this.showResult({
      res,
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.BAD_REQUEST,
    });
  }

  async getRoute(req: IncomingMessage, res: ServerResponse): Promise<void> {
    this.userData = null;
    try {
      await this.getBody(req, res);
      const { url, method } = req;

      if (url && method) {
        const slash = '/';
        const checkUrl = url.endsWith(slash) ? url.slice(0, -1) : url;
        const parseUrl = checkUrl.split(slash).slice(1);
        const [path, endpoint, id] = parseUrl;
        const baseEndpoint = ['', path, endpoint].join(slash);
        const isUrlValid = baseEndpoint === DEFAULT_PATH && parseUrl.length < 4;

        const handler = this.endpoints[method];

        if (handler && isUrlValid) {
          await handler(id, res, req);
        } else {
          return this.showResult({
            res,
            code: HttpStatus.NOT_FOUND,
            message: ResponseMessages.INVALID_ENDPOINT,
          });
        }
      }
    } catch {
      return this.showResult({
        res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ResponseMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async getBody(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      req.on('data', (data) => {
        try {
          this.userData = JSON.parse(data);
        } catch {
          reject(
            this.showResult({
              res,
              code: HttpStatus.INTERNAL_SERVER_ERROR,
              message: ResponseMessages.JSON_ERR,
            }),
          );
        }
      });
      req.on('end', () => resolve());
    });
  }
}
