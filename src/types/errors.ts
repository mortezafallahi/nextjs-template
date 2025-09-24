export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',

  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
}

export interface ValidationErrorDetail {
  type: string;
  msg: string;
  path: string;
  location: string;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details:
    | Record<string, any>
    | ValidationErrorDetail[]
    | undefined;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    details?: Record<string, any> | ValidationErrorDetail[]
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class AppValidationError extends AppError {
  public readonly validation: ValidationErrorDetail[];

  constructor(validationArray: ValidationErrorDetail[]) {
    const message = validationArray[0]?.msg || 'خطای اعتبارسنجی';

    super(message, ErrorCode.VALIDATION_ERROR, 422, validationArray);
    this.name = 'AppValidationError';
    this.validation = validationArray;

    Object.setPrototypeOf(this, AppValidationError.prototype);
  }
}
