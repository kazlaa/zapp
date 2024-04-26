import express from 'express';

export class ErrorHandler extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class MissingProductFieldError extends ErrorHandler {
  constructor(invalidFields: string[]) {
    super(400, `Invalid fields : ${invalidFields.join(', ')}`);
  }
}

export class BadRequestError extends ErrorHandler {
  constructor(message: string) {
    super(400,  message);
  }
}

export class NotfoundError extends ErrorHandler {
  constructor(message: string) {
    super(404,  message);
  }
}

export const handleError = (err: ErrorHandler, res: express.Response): void => {
  if(err instanceof ErrorHandler) {
    const { statusCode, message } = err;
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
    });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};

