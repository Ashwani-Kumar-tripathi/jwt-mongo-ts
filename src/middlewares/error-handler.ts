import { NextFunction, Request, Response } from "express";

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof AuthenticationError) {
    res.status(401).json({ message: "Unauthorized: " + err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { errorHandler, AuthenticationError };
