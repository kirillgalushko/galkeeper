export class FetchError {
  statusCode: number;
  message?: string;
  details?: Response;

  constructor(statusCode: number, message: string, details: Response) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }
}
