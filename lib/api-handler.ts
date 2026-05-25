import { NextResponse } from 'next/server';

interface ApiError {
  message: string;
  status?: number;
}

export async function handleApiError(error: unknown, defaultStatus: number = 500): Promise<NextResponse> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (error instanceof Error) {
    const status = (error as ApiError).status || defaultStatus;
    const message = error.message || 'Internal server error';

    if (isDevelopment) {
      console.error('[API Error]', error);
    }

    return NextResponse.json(
      { error: message },
      { status }
    );
  }

  if (isDevelopment) {
    console.error('[API Error]', error);
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: defaultStatus }
  );
}

export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
