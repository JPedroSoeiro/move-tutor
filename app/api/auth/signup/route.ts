import { NextRequest } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { handleApiError, createSuccessResponse } from '@/lib/api-handler';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      throw new Error(error.message);
    }

    return createSuccessResponse({
      message: 'Usuário criado!',
      user: data.user,
    }, 201);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
