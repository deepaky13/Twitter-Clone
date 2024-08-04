import { StatusCodes } from "http-status-codes";

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.status = StatusCodes.BAD_REQUEST;
  }
}

export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthenticatedError";
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
