import { NextRequest, NextResponse } from 'next/server';
import { initI18n } from './lib/i18n';

export async function middleware(request: NextRequest) {
  const lang = request.cookies.get('NEXT_LOCALE')?.value || 'en';
  await initI18n(lang);
  
  return NextResponse.next();
}
