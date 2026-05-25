import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { handleApiError } from '@/lib/api-handler';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data || []);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
