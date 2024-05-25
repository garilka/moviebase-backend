export class CustomError extends Error {
  cause: any;

  constructor(message: string, cause: any) {
    super(message);
    this.cause = cause;
  }

  toJSON() {
    return {
      message: this.message,
      cause: this.cause,
    };
  }
}
