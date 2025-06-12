import { NextRequest, NextResponse } from 'next/server';
import { createExperience, uploadPhoto } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get('message') as string;
    const title = formData.get('title') as string;
    const musicUrl = formData.get('musicUrl') as string;
    const createdBy = formData.get('createdBy') as string;
    const layout = formData.get('layout') as string;
    const photos = formData.getAll('photos') as File[];
    const backgroundPhotos = formData.getAll('backgroundPhotos') as File[];

    if (!message || !musicUrl || !createdBy || !title || !layout) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (message.length > 600) {
      return NextResponse.json({ message: 'Message exceeds maximum length of 600 characters' }, { status: 400 });
    }

    const photoUrls: string[] = [];
    for (const photo of photos) {
      if (photo instanceof File) {
        const photoUrl = await uploadPhoto(photo);
        photoUrls.push(photoUrl);
      }
    }

    const backgroundPhotoUrls: string[] = [];
    for (const photo of backgroundPhotos) {
      if (photo instanceof File) {
        const photoUrl = await uploadPhoto(photo);
        backgroundPhotoUrls.push(photoUrl);
      }
    }

    const experienceId = await createExperience({
      message,
      title,
      musicUrl,
      photos: photoUrls,
      backgroundPhotos: backgroundPhotoUrls,
      createdBy,
      layout,
    });

    return NextResponse.json({ id: experienceId }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}