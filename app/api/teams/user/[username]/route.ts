import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const { data, error, count } = await supabase
      .from('teams')
      .select('*', { count: 'exact' })
      .eq('author_name', username)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      teams: data,
      count: count || 0,
      username: username,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
