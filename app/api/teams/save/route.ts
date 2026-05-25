import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { authenticate } from '@/lib/middleware/auth';
import { handleApiError, createSuccessResponse } from '@/lib/api-handler';

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await authenticate(request);

  if (!auth.authenticated) {
    return auth.response as Response;
  }

  try {
    const user = auth.user;
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userName = user.user_metadata?.name || user.user_metadata?.full_name || 'Treinador';

    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          ...body,
          user_id: user.id,
          author_name: userName,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return createSuccessResponse(data[0], 201);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
