import request from 'supertest';
import { v4, validate as isIdValid } from 'uuid';
import {
  DEFAULT_PATH,
  DEFAULT_PORT,
  HttpStatus,
  ResponseMessages,
} from '../constants';
import { ServerApp } from '../server';
import { updatedUser } from './fakeData';

const server = new ServerApp(DEFAULT_PORT);

describe('Second scenario: CRUD operations with negative cases and invalid endpoints', () => {
  const app = request(server.getServer());
  const userId = '123456';
  const nonExistId = v4();

  afterAll(() => {
    server.close();
  });

  test('Return invalid endpoint and 404 error', async () => {
    const res = await app.get(`${DEFAULT_PATH}abs`);
    expect(res.body).toStrictEqual({
      code: HttpStatus.NOT_FOUND,
      message: ResponseMessages.INVALID_ENDPOINT,
    });

    const result = await app.get(`${DEFAULT_PATH}/test`).send();
    expect(result.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_ID,
    });
  });

  test('GET: Return User ID is invalid and 400 error', async () => {
    const res = await app.get(`${DEFAULT_PATH}/${userId}`).send();

    expect(isIdValid(userId)).toBe(false);
    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_ID,
    });
  });

  test('PUT: Return User ID is invalid and 400 error', async () => {
    const res = await app.put(`${DEFAULT_PATH}/${userId}`).send(updatedUser);

    expect(isIdValid(userId)).toBe(false);
    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_ID,
    });
  });

  test('DELETE: Return User ID is invalid and 400 error', async () => {
    const res = await app.delete(`${DEFAULT_PATH}/${userId}`).send();

    expect(isIdValid(userId)).toBe(false);
    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_ID,
    });
  });

  test('GET: Return User not found and 404 error', async () => {
    const res = await app.get(`${DEFAULT_PATH}/${nonExistId}`).send();

    expect(isIdValid(nonExistId)).toBe(true);
    expect(res.body).toStrictEqual({
      code: HttpStatus.NOT_FOUND,
      message: ResponseMessages.NOT_FOUND,
    });
  });

  test('PUT: Return User not found and 404 error', async () => {
    const res = await app
      .get(`${DEFAULT_PATH}/${nonExistId}`)
      .send(updatedUser);

    expect(isIdValid(nonExistId)).toBe(true);
    expect(res.body).toStrictEqual({
      code: HttpStatus.NOT_FOUND,
      message: ResponseMessages.NOT_FOUND,
    });
  });

  test('DELETE: Return User not found and 404 error', async () => {
    const res = await app.delete(`${DEFAULT_PATH}/${nonExistId}`).send();

    expect(isIdValid(nonExistId)).toBe(true);
    expect(res.body).toStrictEqual({
      code: HttpStatus.NOT_FOUND,
      message: ResponseMessages.NOT_FOUND,
    });
  });
});
