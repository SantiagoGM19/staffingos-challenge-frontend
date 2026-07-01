import { describe, it, expect } from 'vitest';
import { parseApiError, AppError } from './errors';
import { AxiosError } from 'axios';

describe('errors utils', () => {
  describe('AppError', () => {
    it('should create an AppError with a message', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('AppError');
      expect(error.validationErrors).toBeUndefined();
    });

    it('should create an AppError with validation errors', () => {
      const validationErrors = [{ field: 'email', message: 'Invalid email', rule: 'email' }];
      const error = new AppError('Validation failed', validationErrors);
      expect(error.message).toBe('Validation failed');
      expect(error.validationErrors).toEqual(validationErrors);
    });
  });

  describe('parseApiError', () => {
    it('should return default message for non-Error and non-Axios objects', () => {
      const error = parseApiError('some string error');
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('An unexpected error occurred');
    });

    it('should use the error message for standard Error objects', () => {
      const standardError = new Error('Standard error message');
      const error = parseApiError(standardError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Standard error message');
    });

    it('should handle 422 Axios errors and extract validation errors', () => {
      const validationErrors = [{ field: 'email', message: 'Invalid email', rule: 'email' }];
      const axiosError = new AxiosError('Request failed with status code 422', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 422,
        data: {
          message: 'Validation error',
          errors: validationErrors
        },
        statusText: 'Unprocessable Entity',
        headers: {},
        config: {} as any
      });

      const error = parseApiError(axiosError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Validation error');
      expect(error.validationErrors).toEqual(validationErrors);
    });

    it('should fallback to "Validation failed" if 422 response has no message', () => {
      const validationErrors = [{ field: 'email', message: 'Invalid email', rule: 'email' }];
      const axiosError = new AxiosError('Request failed with status code 422', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 422,
        data: {
          errors: validationErrors
        },
        statusText: 'Unprocessable Entity',
        headers: {},
        config: {} as any
      });

      const error = parseApiError(axiosError);
      expect(error.message).toBe('Validation failed');
    });

    it('should extract the message from a standard Axios error response', () => {
      const axiosError = new AxiosError('Request failed with status code 401', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 401,
        data: {
          message: 'Invalid email or password provided'
        },
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any
      });

      const error = parseApiError(axiosError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid email or password provided');
      expect(error.validationErrors).toBeUndefined();
    });

    it('should fallback to default message if Axios error response has no data message', () => {
      const axiosError = new AxiosError('Request failed with status code 500', 'ERR_BAD_RESPONSE', undefined, undefined, {
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any
      });

      const error = parseApiError(axiosError, 'Fallback error');
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Fallback error');
    });
  });
});
