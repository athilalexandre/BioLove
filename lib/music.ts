import { google } from 'googleapis';
import SpotifyWebApi from 'spotify-web-api-node';

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Initialize YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Cache for music conversions
const musicCache = new Map<string, { youtubeUrl: string; expiresAt: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getSpotifyTrackInfo(spotifyUrl: string): Promise<string> {
  try {
    // Extract track ID from URL
    const trackId = spotifyUrl.split('track/')[1]?.split('?')[0];
    if (!trackId) throw new Error('Invalid Spotify URL');

    // Check cache first
    const cached = musicCache.get(trackId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.youtubeUrl;
    }

    // Get Spotify access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    // Get track details
    const track = await spotifyApi.getTrack(trackId);
    const trackInfo = track.body;

    // Search YouTube for the track
    const searchQuery = `${trackInfo.name} ${trackInfo.artists.map((a: { name: string }) => a.name).join(' ')} official music video`;
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: searchQuery,
      type: ['video'],
      videoCategoryId: '10', // Music category
      maxResults: 1
    });

    const videoId = searchResponse.data.items?.[0]?.id?.videoId;
    if (!videoId) throw new Error('No matching YouTube video found');

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Cache the result
    musicCache.set(trackId, {
      youtubeUrl,
      expiresAt: Date.now() + CACHE_DURATION
    });

    return youtubeUrl;
  } catch (error) {
    console.error('Error converting Spotify track:', error);
    // Fallback to a default music video if conversion fails
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
}

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  Array.from(musicCache.entries()).forEach(([key, value]) => {
    if (value.expiresAt < now) {
      musicCache.delete(key);
    }
  });
}, 60 * 60 * 1000); // Clean