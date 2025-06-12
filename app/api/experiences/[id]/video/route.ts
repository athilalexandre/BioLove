import { NextRequest, NextResponse } from 'next/server';
import { getExperience } from '@/lib/storage';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const experience = await getExperience(id);

    if (!experience) {
      return new NextResponse('Experience not found', { status: 404 });
    }

    // Return the experience data that will be used to generate the video
    return NextResponse.json({
      ...experience,
      videoGenerationUrl: `/api/experiences/${id}/video/generate`
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
} 