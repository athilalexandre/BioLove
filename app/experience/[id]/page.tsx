'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export interface Experience {
  id: string;
  message: string;
  musicUrl: string;
  photos: string[];
  backgroundPhotos?: string[];
  createdAt: string;
  createdBy: string;
}

export default function ExperiencePage() {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentBackgroundPhotoIndex, setCurrentBackgroundPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [musicDuration, setMusicDuration] = useState(0);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      const fetchExperience = async () => {
        try {
          const response = await fetch(`/api/experiences/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch experience');
          }
          const data: Experience = await response.json();
          setExperience(data);
        } catch (error) {
          console.error("Error fetching experience:", error);
        }
      };
      fetchExperience();
    }
  }, [id]);

  useEffect(() => {
    const paragraph = messageRef.current;
    if (!paragraph || !musicDuration || !isPlaying) return;

    const scrollHeight = paragraph.scrollHeight;
    const clientHeight = paragraph.clientHeight;

    if (scrollHeight <= clientHeight) return;

    const scrollDistance = scrollHeight - clientHeight;
    const scrollSpeed = scrollDistance / musicDuration;

    let startTime: DOMHighResTimeStamp | null = null;
    let animationFrameId: number;

    const animateScroll = (currentTime: DOMHighResTimeStamp) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = (currentTime - startTime) / 1000;

      let newScrollTop = (elapsedTime * scrollSpeed) % scrollHeight;
      if (newScrollTop > scrollDistance) {
        newScrollTop = newScrollTop - scrollDistance;
      }
      paragraph.scrollTop = newScrollTop;

      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [experience?.message, musicDuration, isPlaying]);

  useEffect(() => {
    if (experience?.photos && experience.photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => 
          prev === experience.photos.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    } else if (experience?.photos && experience.photos.length === 1) {
        setCurrentPhotoIndex(0);
    }
  }, [experience?.photos]);

  useEffect(() => {
    if (experience?.backgroundPhotos && experience.backgroundPhotos.length > 1) {
      const interval = setInterval(() => {
        setCurrentBackgroundPhotoIndex((prev) =>
          prev === experience.backgroundPhotos!.length - 1 ? 0 : prev + 1
        );
      }, 10000);

      return () => clearInterval(interval);
    } else if (experience?.backgroundPhotos && experience.backgroundPhotos.length === 1) {
        setCurrentBackgroundPhotoIndex(0);
    }
  }, [experience?.backgroundPhotos]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setIsMuted(false);
  };

  if (!experience) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { photos, message, musicUrl, backgroundPhotos = [] } = experience;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {backgroundPhotos.length > 0 && (
        <div className="fixed inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBackgroundPhotoIndex}
              src={backgroundPhotos[currentBackgroundPhotoIndex] || ''}
              alt="Background"
              className="w-full h-full object-cover opacity-20 transition-opacity duration-1000"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8 max-w-6xl mx-auto w-full">
        <div className="w-full lg:w-1/2 flex justify-center">
          {photos.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex]}
                alt="Experience Photo"
                className="rounded-lg shadow-2xl w-full max-w-sm lg:max-w-md h-auto object-contain"
                style={{ border: '4px solid var(--photo-border-color, #f0abfc)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="message-scroll-container max-w-2xl text-center lg:text-left text-white px-6 py-8 rounded-lg bg-black bg-opacity-80 shadow-lg relative"
            style={{ maxHeight: 'min(100vh - 200px, 450px)' }}
          >
            <p ref={messageRef} className="text-lg md:text-xl font-serif leading-relaxed whitespace-pre-wrap tracking-wide drop-shadow-lg">
              {message}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent via-black/70 z-20 flex flex-col items-center justify-center">
        <div className="max-w-2xl mx-auto flex items-center space-x-4 p-3 rounded-full custom-player-bg shadow-lg">
          <ReactPlayer
            ref={playerRef}
            url={musicUrl}
            width="0px"
            height="0px"
            playing={isPlaying}
            muted={isMuted}
            volume={volume}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onDuration={setMusicDuration}
            config={{
              youtube: { playerVars: { autoplay: 1 } },
              vimeo: { playerOptions: { autoplay: true } },
              soundcloud: { options: { auto_play: true } },
            }}
          />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white p-3 rounded-full custom-control-bg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 md:w-32 h-2 rounded-lg appearance-none cursor-pointer range-lg bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 volume-slider"
          />

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white p-3 rounded-full custom-control-bg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isMuted || volume === 0 ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .message-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .message-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        :root {
          --photo-border-color: #f0abfc;
          --player-button-color: #e91e63;
        }

        .custom-player-bg {
          background-color: var(--player-button-color);
        }

        .custom-control-bg {
          background-color: var(--player-button-color);
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
} 