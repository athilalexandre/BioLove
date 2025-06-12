import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyTrackInfo } from '@/lib/music';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spotifyUrl = searchParams.get('spotifyUrl');

  if (!spotifyUrl) {
    return NextResponse.json({ message: 'Spotify URL is required' }, { status: 400 });
  }

  try {
    const youtubeUrl = await getSpotifyTrackInfo(spotifyUrl);
    return NextResponse.json({ youtubeUrl });
  } catch (error) {
    console.error('Error in music conversion API:', error);
    return NextResponse.json({ message: 'Failed to convert music URL' }, { status: 500 });
  }
} 