export default class HttpStatusError extends Error {
  httpStatus: number;
  constructor(httpStatus: number, message = '') {
    super(message);
    this.httpStatus = httpStatus;
  }
}