'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

const layoutConfigs = {
  empty_selection: {
    name: "Selecione um Layout",
    description: "Por favor, selecione um layout para ver as opções de upload de fotos.",
    usesMainPhotos: false,
    usesBackgroundPhotos: false,
    minMainPhotos: 0,
    maxMainPhotos: 0,
    minBackgroundPhotos: 0,
    maxBackgroundPhotos: 0,
  },
  default: {
    name: "Default Layout",
    description: "Um layout padrão que exibe uma foto principal em destaque e a mensagem abaixo, com fotos de fundo sutis.",
    usesMainPhotos: true,
    usesBackgroundPhotos: true,
    minMainPhotos: 1,
    maxMainPhotos: 10,
    minBackgroundPhotos: 1,
    maxBackgroundPhotos: 10,
  },
  full_screen_photo: {
    name: "Full Screen Photo Layout",
    description: "Exibe uma única foto em tela cheia como plano de fundo, com o texto sobreposto e elegante. Não utiliza fotos de fundo adicionais.",
    usesMainPhotos: true,
    usesBackgroundPhotos: false,
    minMainPhotos: 1,
    maxMainPhotos: 1,
    minBackgroundPhotos: 0,
    maxBackgroundPhotos: 0,
  },
  centered_message: {
    name: "Centered Message Layout",
    description: "Foca a mensagem e um carrossel de fotos menores e giratórias no centro, com fotos de fundo em movimento suave. Ideal para um foco central.",
    usesMainPhotos: true,
    usesBackgroundPhotos: true,
    minMainPhotos: 1,
    maxMainPhotos: 5,
    minBackgroundPhotos: 1,
    maxBackgroundPhotos: 10,
  },
  split_screen: {
    name: "Split Screen Layout",
    description: "Divide a tela horizontalmente para exibir fotos de um lado e a mensagem do outro, criando uma interação dinâmica e moderna.",
    usesMainPhotos: true,
    usesBackgroundPhotos: true,
    minMainPhotos: 1,
    maxMainPhotos: 10,
    minBackgroundPhotos: 1,
    maxBackgroundPhotos: 10,
  },
  vertical_timeline: {
    name: "Vertical Timeline Layout",
    description: "Organiza fotos e trechos de mensagem em uma linha do tempo vertical, perfeito para narrativas sequenciais ou histórias progressivas.",
    usesMainPhotos: true, // Photos are tied to sentences
    usesBackgroundPhotos: true,
    minMainPhotos: 1,
    maxMainPhotos: 20, // Allowing up to 20 for more flexibility
    minBackgroundPhotos: 1,
    maxBackgroundPhotos: 10,
  },
  photo_grid_message: {
    name: "Photo Grid Message Layout",
    description: "Apresenta uma grade dinâmica de fotos que se movem, com a mensagem integrada ou em destaque abaixo da grade. Ótimo para múltiplos momentos.",
    usesMainPhotos: true,
    usesBackgroundPhotos: true,
    minMainPhotos: 3,
    maxMainPhotos: 9, // Max 9 photos for the grid as per component
    minBackgroundPhotos: 1,
    maxBackgroundPhotos: 10,
  },
};

type LayoutKeys = keyof typeof layoutConfigs;

export default function CreateExperiencePage() {
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [backgroundPhotos, setBackgroundPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutKeys>('empty_selection');
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

    const currentLayoutConfig = layoutConfigs[layout];

    // Validate main photos
    if (currentLayoutConfig.usesMainPhotos) {
      if (photos.length < currentLayoutConfig.minMainPhotos || photos.length > currentLayoutConfig.maxMainPhotos) {
        setError(`Para o layout '${currentLayoutConfig.name}', você deve fazer upload de ${currentLayoutConfig.minMainPhotos} a ${currentLayoutConfig.maxMainPhotos} fotos principais.`);
        setLoading(false);
        return;
      }
    } else if (photos.length > 0) {
      setError(`O layout '${currentLayoutConfig.name}' não utiliza fotos principais.`);
      setLoading(false);
      return;
    }

    // Validate background photos
    if (currentLayoutConfig.usesBackgroundPhotos) {
      if (backgroundPhotos.length < currentLayoutConfig.minBackgroundPhotos || backgroundPhotos.length > currentLayoutConfig.maxBackgroundPhotos) {
        setError(`Para o layout '${currentLayoutConfig.name}', você deve fazer upload de ${currentLayoutConfig.minBackgroundPhotos} a ${currentLayoutConfig.maxBackgroundPhotos} fotos de fundo.`);
        setLoading(false);
        return;
      }
    } else if (backgroundPhotos.length > 0) {
      setError(`O layout '${currentLayoutConfig.name}' não utiliza fotos de fundo.`);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('title', title);
      formData.append('musicUrl', musicUrl);
      formData.append('createdBy', 'admin');
      formData.append('layout', layout);

      // Only append photos if the current layout uses them
      if (layoutConfigs[layout].usesMainPhotos) {
        photos.forEach((photo) => {
          formData.append('photos', photo);
        });
      }

      if (layoutConfigs[layout].usesBackgroundPhotos) {
        backgroundPhotos.forEach((photo) => {
          formData.append('backgroundPhotos', photo);
        });
      }

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
  const currentLayoutConfig = layoutConfigs[layout];

  const MAX_FILE_SIZE_MB = 5; // Example: 5MB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-screen-md h-full flex flex-col overflow-y-auto overflow-x-hidden mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary-800 mb-6 flex-shrink-0">Create New Experience</h1>
        <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col overflow-x-hidden">
          {/* Title and Music URL */}
          <div className="flex flex-col space-y-4 flex-shrink-0">
            <div className="flex-1">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter a title for the experience"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="musicUrl" className="block text-sm font-medium text-gray-700">Music URL (YouTube)</label>
              <input
                type="url"
                id="musicUrl"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                className="mt-1 block w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter YouTube URL"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex-shrink-0">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message for Partner</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 block w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              maxLength={MAX_MESSAGE_LENGTH}
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {message.length} / {MAX_MESSAGE_LENGTH} characters
            </p>
          </div>

          {/* Choose Layout */}
          <div className="flex-shrink-0">
            <label htmlFor="layout" className="block text-sm font-medium text-gray-700">Choose Layout</label>
            <select
              id="layout"
              value={layout}
              onChange={(e) => setLayout(e.target.value as LayoutKeys)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {Object.entries(layoutConfigs).map(([key, config]) => (
                <option key={key} value={key} disabled={key === 'empty_selection' && layout !== 'empty_selection'}>
                  {config.name}
                </option>
              ))}
            </select>
            {currentLayoutConfig && (
              <p className="text-xs text-gray-500 mt-1">{currentLayoutConfig.description}</p>
            )}
          </div>

          {/* Photos Uploads Section */}
          {(currentLayoutConfig?.usesMainPhotos || currentLayoutConfig?.usesBackgroundPhotos) && (
            <div className="flex flex-col flex-shrink-0">
              {currentLayoutConfig?.usesMainPhotos && (
                <div className="flex-1 flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700">Photos (Main)</label>
                  <div
                    {...getRootProps()}
                    className="mt-1 flex justify-center p-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className="text-primary-600 text-xs font-bold">Solte os arquivos aqui ...</p>
                    ) : (
                      <p className="text-center text-gray-500 text-xs" style={{ wordBreak: 'break-word' }}>
                        <span className="font-bold">Arraste e solte arquivos aqui, ou clique para selecionar arquivos.</span><br /><br />
                        <span className="text-xs">Max: {MAX_FILE_SIZE_MB}MB por arquivo. Não há limite de dimensões de imagem.</span>
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
              )}

              {currentLayoutConfig?.usesBackgroundPhotos && (
                <div className="flex-1 flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700">Photos (Background)</label>
                  <div
                    {...getBackgroundRootProps()}
                    className="mt-1 flex justify-center p-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                  >
                    <input {...getBackgroundInputProps()} />
                    {isBackgroundDragActive ? (
                      <p className="text-primary-600 text-xs font-bold">Solte os arquivos aqui ...</p>
                    ) : (
                      <p className="text-center text-gray-500 text-xs" style={{ wordBreak: 'break-word' }}>
                        <span className="font-bold">Arraste e solte arquivos aqui, ou clique para selecionar arquivos.</span><br /><br />
                        <span className="text-xs">Max: {MAX_FILE_SIZE_MB}MB por arquivo. Não há limite de dimensões de imagem.</span>
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
              )}
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* Action Buttons: Create Experience and Logout */}
          <div className="flex flex-col md:flex-row gap-4 mt-auto pt-4 flex-shrink-0">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex-1"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Experience'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex-1"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 