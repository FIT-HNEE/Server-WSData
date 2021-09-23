import { NextFunction, Request, Response } from 'express';
import ApiError from './ApiError';

const errorHandler = (
  error: Error | ApiError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error && !res.headersSent) {
    const errorResponse =
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, true);
    res.status(errorResponse.code).send(errorResponse)
  } else {
    next()
  }
}

export default errorHandler