const DEFAULT_PORT = 4000;
const DEFAULT_PATH = '/api/users';

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export { DEFAULT_PORT, DEFAULT_PATH, HttpStatus };
