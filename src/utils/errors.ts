import { isAxiosError } from 'axios';
import type { ValidationError } from '@/models/auth';

export class AppError extends Error {
  public validationErrors?: ValidationError[];

  constructor(message: string, validationErrors?: ValidationError[]) {
    super(message);
    this.name = 'AppError';
    this.validationErrors = validationErrors;
  }
}

export const parseApiError = (error: unknown, defaultMessage = 'An unexpected error occurred'): AppError => {
  if (!isAxiosError(error)) {
    if (error instanceof Error) {
      return new AppError(error.message);
    }
    return new AppError(defaultMessage);
  }

  // Handle 422 Validation Errors
  if (error.response?.status === 422 && error.response.data?.errors) {
    return new AppError('Validation failed', error.response.data.errors);
  }

  // Handle standardized API error responses
  if (error.response?.data?.message) {
    return new AppError(error.response.data.message);
  }

  return new AppError(defaultMessage);
};
