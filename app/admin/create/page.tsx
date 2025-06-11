'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

export default function CreateExperiencePage() {
  const [message, setMessage] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [backgroundPhotos, setBackgroundPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPhotos(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const onDropBackground = useCallback((acceptedFiles: File[]) => {
    setBackgroundPhotos(acceptedFiles);
  }, []);

  const { getRootProps: getBackgroundRootProps, getInputProps: getBackgroundInputProps, isDragActive: isBackgroundDragActive } = useDropzone({
    onDrop: onDropBackground,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('musicUrl', musicUrl);
      formData.append('createdBy', 'admin');

      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      backgroundPhotos.forEach((photo) => {
        formData.append('backgroundPhotos', photo);
      });

      const response = await fetch('/api/experiences', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create experience');
      }

      const data = await response.json();
      router.push(`/experience/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    router.push('/admin/login');
  };

  const MAX_MESSAGE_LENGTH = 600;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-primary-800 mb-6">Create New Experience</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message for Partner</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              maxLength={MAX_MESSAGE_LENGTH}
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {message.length} / {MAX_MESSAGE_LENGTH} characters
            </p>
          </div>

          <div>
            <label htmlFor="musicUrl" className="block text-sm font-medium text-gray-700">Music URL (YouTube/Spotify)</label>
            <input
              type="url"
              id="musicUrl"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photos (Main)</label>
            <div
              {...getRootProps()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-primary-600">Drop the files here ...</p>
              ) : (
                <p className="text-center text-gray-500">
                  Drag 'n' drop some files here, or click to select files
                </p>
              )}
            </div>
            <aside className="mt-2 text-sm text-gray-600">
              {photos.length > 0 ? (
                <p>{photos.length} file(s) selected</p>
              ) : (
                <p>No files selected.</p>
              )}
            </aside>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photos (Background)</label>
            <div
              {...getBackgroundRootProps()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
            >
              <input {...getBackgroundInputProps()} />
              {isBackgroundDragActive ? (
                <p className="text-primary-600">Drop the files here ...</p>
              ) : (
                <p className="text-center text-gray-500">
                  Drag 'n' drop some files here, or click to select files
                </p>
              )}
            </div>
            <aside className="mt-2 text-sm text-gray-600">
              {backgroundPhotos.length > 0 ? (
                <p>{backgroundPhotos.length} file(s) selected</p>
              ) : (
                <p>No files selected.</p>
              )}
            </aside>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Experience'}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 