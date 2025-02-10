import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret');
  
  // Validate secret
  if (secret !== process.env.CACHE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { paths } = await req.json();
    paths.forEach(path => revalidatePath(path));
    
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Revalidation failed' }, 
      { status: 500 }
    );
  }
}
