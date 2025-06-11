'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicDuration, setMusicDuration] = useState(0);
  const messageRef = useRef<HTMLParagraphElement>(null);
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
          prev === experience.backgroundPhotos.length - 1 ? 0 : prev + 1
        );
      }, 10000);

      return () => clearInterval(interval);
    } else if (experience?.backgroundPhotos && experience.backgroundPhotos.length === 1) {
        setCurrentBackgroundPhotoIndex(0);
    }
  }, [experience?.backgroundPhotos]);

  if (!experience) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { photos, message, musicUrl, backgroundPhotos } = experience;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {backgroundPhotos && backgroundPhotos.length > 0 && (
        <div className="fixed inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBackgroundPhotoIndex}
              src={backgroundPhotos[currentBackgroundPhotoIndex]}
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
                className="rounded-lg shadow-lg w-full h-auto max-h-[400px] object-contain"
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
            className="message-scroll-container max-w-2xl text-center lg:text-left text-white px-4 py-6 rounded-lg bg-black bg-opacity-70"
            style={{ maxHeight: 'min(100vh - 200px, 400px)' }}
          >
            <p ref={messageRef} className="text-xl md:text-2xl font-serif leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70 z-20">
        <div className="max-w-2xl mx-auto">
          <ReactPlayer
            url={musicUrl}
            width="100%"
            height="80px"
            playing={true}
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onDuration={setMusicDuration}
          />
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
      `}</style>
    </div>
  );
} 