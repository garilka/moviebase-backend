import { NextFunction, Request, Response } from 'express';

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);

  if (error.cause) {
    console.error('Error cause:', error.cause);
  }

  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

  res.status(500).json({ message: errorMessage });
};
