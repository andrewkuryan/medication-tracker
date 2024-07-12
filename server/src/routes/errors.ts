export class ClientError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
  }
}

export class UnauthorizedError extends ClientError {
  constructor(resourceName: string, reason: string) {
    super(`Access to the ${resourceName} is prohibited: ${reason}`, 401);
  }
}

export class NotFoundError extends ClientError {
  constructor(resourceName: string, query: string) {
    super(`Cannot find the ${resourceName} with ${query}`, 404);
  }
}
