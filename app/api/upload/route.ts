import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  const serverSupabase = createServerSupabaseClient();
  
  const { data: { session } } = await serverSupabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: adminProfile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!adminProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await request.formData();
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const uploadedUrls: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    uploadedUrls.push(urlData.publicUrl);
  }

  return NextResponse.json({ urls: uploadedUrls });
}
