import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { authenticate } from '@/lib/middleware/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const auth = await authenticate(request);

  if (!auth.authenticated) {
    return auth.response as Response;
  }

  try {
    const { id } = await params;
    const userId = auth.user?.id;

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return Response.json({}, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
