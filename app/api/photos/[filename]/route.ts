import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  const filePath = path.join(process.cwd(), 'data', 'photos', filename);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');
    
    return new NextResponse(fileBuffer, {
      headers,
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
} 