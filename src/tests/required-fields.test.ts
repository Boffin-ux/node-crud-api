import request from 'supertest';
import {
  DEFAULT_PATH,
  DEFAULT_PORT,
  HttpStatus,
  ResponseMessages,
} from '../constants';
import { ServerApp } from '../server';
import {
  newUser,
  notValidAge,
  notValidHobbies,
  notValidUserName,
} from './fakeData';

const server = new ServerApp(DEFAULT_PORT);

describe('Third scenario: POST and PUT do not contain fields, invalid type or missing required fields', () => {
  const app = request(server.getServer());
  let userId = '';

  afterAll(() => {
    server.close();
  });

  test('POST: Create new user', async () => {
    const res = await app.post(DEFAULT_PATH).send(newUser);

    expect(res.statusCode).toBe(HttpStatus.CREATED);
    expect(res.body).toMatchObject(newUser);
    userId = res.body.id;
  });

  test('POST: Create new user does not contain required fields and get 400 error', async () => {
    const res = await app.post(DEFAULT_PATH).send({});

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });

  test('PUT: Update user does not contain required fields and get 400 error', async () => {
    const res = await app.put(`${DEFAULT_PATH}/${userId}`).send({});

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });

  test('POST: Create new user with invalid type or missing field age and get 400 error', async () => {
    const res = await app.post(DEFAULT_PATH).send(notValidAge);

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });

    const result = await app.post(DEFAULT_PATH).send({
      username: 'User',
      hobbies: ['JS', 'TV'],
    });

    expect(result.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });

  test('PUT: Update user with invalid type or missing field age and get 400 error', async () => {
    const res = await app.put(`${DEFAULT_PATH}/${userId}`).send(notValidAge);

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });

    const result = await app.put(`${DEFAULT_PATH}/${userId}`).send({
      username: 'User',
      hobbies: ['JS', 'TV'],
    });

    expect(result.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });

  test('POST: Create a new user with invalid type or missing field username and get 400 error', async () => {
    const res = await app.post(DEFAULT_PATH).send(notValidUserName);

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });

    const result = await app.post(DEFAULT_PATH).send({
      age: 35,
      hobbies: ['JS', 'TV'],
    });

    expect(result.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });

  test('PUT: Update user with invalid type or missing field username and get 400 error', async () => {
    const res = await app
      .put(`${DEFAULT_PATH}/${userId}`)
      .send(notValidUserName);

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });

    const result = await app.put(`${DEFAULT_PATH}/${userId}`).send({
      age: 35,
      hobbies: ['JS', 'TV'],
    });

    expect(result.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });

  test('POST: Create a new user with invalid type or missing field hobbies and get 400 error', async () => {
    const res = await app.post(DEFAULT_PATH).send(notValidHobbies);

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });

    const result = await app.post(DEFAULT_PATH).send({
      username: 'User1',
      age: 31,
    });

    expect(result.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });

  test('PUT: Update user with invalid type or missing field hobbies and get 400 error', async () => {
    const res = await app
      .put(`${DEFAULT_PATH}/${userId}`)
      .send(notValidHobbies);

    expect(res.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });

    const result = await app.put(`${DEFAULT_PATH}/${userId}`).send({
      username: 'User1',
      age: 31,
    });

    expect(result.body).toStrictEqual({
      code: HttpStatus.BAD_REQUEST,
      message: ResponseMessages.INVALID_PARAMS,
    });
  });
});
