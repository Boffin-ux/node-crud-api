import request from 'supertest';
import { validate as isIdValid } from 'uuid';
import {
  DEFAULT_PATH,
  DEFAULT_PORT,
  HttpStatus,
  ResponseMessages,
} from '../constants';
import { ServerApp } from '../server';
import { newUser, updatedUser } from './fakeData';

const server = new ServerApp(DEFAULT_PORT);

describe('First scenario: CRUD operations with positive cases', () => {
  const app = request(server.getServer());
  let userId = '';

  afterAll(() => {
    server.close();
  });

  test('GET: Return empty array of users', async () => {
    const res = await app.get(DEFAULT_PATH);
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toEqual([]);
  });

  test('POST: Create new user', async () => {
    const res = await app.post(DEFAULT_PATH).send(newUser);

    expect(res.statusCode).toBe(HttpStatus.CREATED);
    expect(res.body).toMatchObject(newUser);
    userId = res.body.id;
  });

  test('GET: Return array of users after adding new one', async () => {
    const res = await app.get(DEFAULT_PATH);
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toMatchObject([{ ...newUser, id: userId }]);
  });

  test('GET: Return one user by userId', async () => {
    const res = await app.get(`${DEFAULT_PATH}/${userId}`).send();

    expect(isIdValid(userId)).toBe(true);
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toMatchObject(newUser);
  });

  test('PUT: Update one user by userId', async () => {
    const res = await app.put(`${DEFAULT_PATH}/${userId}`).send(updatedUser);

    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toMatchObject(updatedUser);
    expect(res.body).toMatchObject({ id: userId });
  });

  test('DELETE: Delete one user by userId', async () => {
    const res = await app.delete(`${DEFAULT_PATH}/${userId}`).send();

    expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
    expect(res.body).toBe('');
  });

  test('GET: Get user by id after deletion', async () => {
    const res = await app.get(`${DEFAULT_PATH}/${userId}`);

    expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(res.body).toStrictEqual({
      code: HttpStatus.NOT_FOUND,
      message: ResponseMessages.NOT_FOUND,
    });
    userId = '';
  });
});
