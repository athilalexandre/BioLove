import { createExperience, uploadPhoto } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message') as string;
    const musicUrl = formData.get('musicUrl') as string;
    const createdBy = formData.get('createdBy') as string;
    const files = formData.getAll('photos') as File[];
    const backgroundFiles = formData.getAll('backgroundPhotos') as File[];

    const photoUrls: string[] = [];
    for (const file of files) {
      const photoUrl = await uploadPhoto(file);
      photoUrls.push(photoUrl);
    }

    const backgroundPhotoUrls: string[] = [];
    for (const file of backgroundFiles) {
      const photoUrl = await uploadPhoto(file);
      backgroundPhotoUrls.push(photoUrl);
    }

    const experienceId = await createExperience({
      message,
      musicUrl,
      photos: photoUrls,
      backgroundPhotos: backgroundPhotoUrls,
      createdBy,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: experienceId });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
} 