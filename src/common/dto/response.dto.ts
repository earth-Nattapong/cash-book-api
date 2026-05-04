import { PaginationMeta } from './pagination.dto';

// Base response interface for all API responses
export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp?: Date;
}

// Generic success response with data
export class ApiResponse<T = any> implements BaseResponse {
  readonly success: boolean = true;
  readonly message: string;
  readonly data: T;
  readonly timestamp: Date;

  constructor(data: T, message: string = 'Operation completed successfully') {
    this.data = data;
    this.message = message;
    this.timestamp = new Date();
  }
}

// Success response without data (for operations like delete)
export class ApiMessageResponse implements BaseResponse {
  readonly success: boolean = true;
  readonly message: string;
  readonly timestamp: Date;

  constructor(message: string) {
    this.message = message;
    this.timestamp = new Date();
  }
}

// Paginated response with data and pagination metadata
export class ApiPaginatedResponse<T = any> implements BaseResponse {
  readonly success: boolean = true;
  readonly message: string;
  readonly data: T[];
  readonly meta: PaginationMeta;
  readonly timestamp: Date;

  constructor(
    data: T[],
    meta: PaginationMeta,
    message: string = 'Data retrieved successfully',
  ) {
    this.data = data;
    this.meta = meta;
    this.message = message;
    this.timestamp = new Date();
  }
}

// Error response
export class ApiErrorResponse implements BaseResponse {
  readonly success: boolean = false;
  readonly message: string;
  readonly error?: string;
  readonly statusCode?: number;
  readonly controllerMethod?: string;
  readonly timestamp: Date;

  constructor(
    message: string,
    error?: string,
    statusCode?: number,
    controllerMethod?: string,
  ) {
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
    this.controllerMethod = controllerMethod;
    this.timestamp = new Date();
  }
}

// Validation error response with field-specific errors
export class ApiValidationErrorResponse implements BaseResponse {
  readonly success: boolean = false;
  readonly message: string;
  readonly errors: Record<string, string[]>;
  readonly statusCode: number = 400;
  readonly controllerMethod?: string;
  readonly timestamp: Date;

  constructor(
    errors: Record<string, string[]>,
    message: string = 'Validation failed',
    controllerMethod?: string,
  ) {
    this.message = message;
    this.errors = errors;
    this.controllerMethod = controllerMethod;
    this.timestamp = new Date();
  }
}

// Response factory for consistent response creation
export class ResponseFactory {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(data, message);
  }

  static message(message: string): ApiMessageResponse {
    return new ApiMessageResponse(message);
  }

  static paginated<T>(
    data: T[],
    meta: PaginationMeta,
    message?: string,
  ): ApiPaginatedResponse<T> {
    return new ApiPaginatedResponse(data, meta, message);
  }

  static error(
    message: string,
    error?: string,
    statusCode?: number,
    controllerMethod?: string,
  ): ApiErrorResponse {
    return new ApiErrorResponse(message, error, statusCode, controllerMethod);
  }

  static validationError(
    errors: Record<string, string[]>,
    message?: string,
    controllerMethod?: string,
  ): ApiValidationErrorResponse {
    return new ApiValidationErrorResponse(errors, message, controllerMethod);
  }
}
