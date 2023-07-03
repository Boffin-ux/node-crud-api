const DEFAULT_PORT = 4000;
const DEFAULT_PATH = '/api/users';
const HOST = 'localhost';

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

enum ResponseMessages {
  OK = 'OK',
  NOT_FOUND = 'Not found',
  CREATED = 'Created',
  BAD_REQUEST = 'Bad request',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  JSON_ERR = 'Invalid JSON format',
  INVALID_PARAMS = 'Invalid parameters (name, age and hobbies is required fields)',
  INVALID_ENDPOINT = 'Invalid endpoint',
  INVALID_ID = `User ID isn't valid`,
  SUCCESS = 'Success',
}

export { DEFAULT_PORT, DEFAULT_PATH, HttpStatus, ResponseMessages, HOST };
