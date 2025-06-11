import { getExperience } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const experience = await getExperience(id);

    if (!experience) {
      return new NextResponse('Experience not found', { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
} 