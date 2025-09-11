// Utility for handling unknown errors in catch blocks
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
};

// Create typed error for better error handling
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Handle axios errors specifically
export const handleApiError = (error: unknown): never => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    const message = apiError.response?.data?.message || 'API Error occurred';
    throw new AppError(message);
  }
  throw new AppError(getErrorMessage(error));
};
