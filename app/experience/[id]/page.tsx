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
  title: string;
}

export default function ExperiencePage() {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentBackgroundPhotoIndex, setCurrentBackgroundPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [musicDuration, setMusicDuration] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const params = useParams();
  const id = params?.id as string;
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const SENTENCE_DURATION_MS = 5000; // 5 seconds

  // Helper function to split message into sentences
  const splitIntoSentences = (text: string): string[] => {
    // This regex splits by common sentence-ending punctuation, including handling of abbreviations.
    // It keeps the punctuation with the sentence.
    const sentenceRegex = /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s+/g;
    return text.split(sentenceRegex).filter(s => s.trim() !== '');
  };

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
    if (experience?.message) {
      setSentences(splitIntoSentences(experience.message));
    }
  }, [experience?.message]);

  useEffect(() => {
    if (!messageRef.current || !musicDuration || !isPlaying || sentences.length === 0) return;

    const container = messageRef.current;
    const sentenceElements = Array.from(container.children) as HTMLElement[];

    if (sentenceElements.length === 0) return;

    const durationPerSentence = SENTENCE_DURATION_MS; 

    let startTime: DOMHighResTimeStamp | null = null;
    let animationFrameId: number;
    let currentSentenceEndTime: number = 0; // Time when the current sentence animation should end

    const animateScroll = (currentTime: DOMHighResTimeStamp) => {
      if (!startTime) {
        startTime = currentTime;
        currentSentenceEndTime = startTime + durationPerSentence; // Set end time for the first sentence
      }

      // Check if it's time to move to the next sentence
      if (currentTime >= currentSentenceEndTime) {
        setCurrentSentenceIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % sentences.length;
          if (nextIndex === 0) {
            // If we've looped back to the first sentence, show title for the duration of the last sentence
            // then reset and start over.
            if (prevIndex === sentences.length - 1) {
              setShowTitle(true); // Show title when all sentences have played
              setTimeout(() => {
                setShowTitle(false); // Hide title after its duration
                setCurrentSentenceIndex(0); // Reset index to start sentence loop again
                if (playerRef.current) {
                  playerRef.current.seekTo(0); // Seek player to start
                }
              }, SENTENCE_DURATION_MS); // Title display duration
              return prevIndex; // Stay on the last sentence index until title transition is complete
            }
            if (playerRef.current) {
                playerRef.current.seekTo(0); // Seek player to start if looping back to first sentence normally
            }
          }
          currentSentenceEndTime = currentTime + durationPerSentence; // Set end time for the next sentence
          return nextIndex;
        });
      }

      // Scroll the container to keep the current sentence visible
      const currentSentenceElement = sentenceElements[currentSentenceIndex];
      if (currentSentenceElement) {
        const sentenceTop = currentSentenceElement.offsetTop;
        const sentenceBottom = sentenceTop + currentSentenceElement.clientHeight;
        
        const currentScrollTop = container.scrollTop;
        const currentScrollBottom = currentScrollTop + container.clientHeight;

        if (sentenceTop < currentScrollTop || sentenceBottom > currentScrollBottom) {
          container.scrollTop = sentenceTop - (container.clientHeight / 2) + (currentSentenceElement.clientHeight / 2); // Center the sentence
        }
      }

      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [sentences, isPlaying, currentSentenceIndex, musicDuration]);

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

  const { photos, message, musicUrl, backgroundPhotos = [], title } = experience;

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

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-12 max-w-7xl mx-auto w-full">
        <div className="w-full lg:w-1/2 flex justify-center">
          {photos.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex]}
                alt="Experience Photo"
                className="rounded-xl shadow-2xl w-full object-contain transition-all duration-300 ease-in-out"
                style={{ 
                  maxWidth: 'min(calc(100vw - 64px), 600px)',
                  maxHeight: 'min(calc(100vh - 200px), 600px)',
                }}
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
            className="message-scroll-container max-w-full mx-auto px-8 py-10 bg-[rgba(0,0,0,0.6)] relative overflow-y-auto"
            style={{ 
              minHeight: '100px',
              height: 'auto',
              maxHeight: 'min(calc(100vh - 250px), 600px)'
            }}
            ref={messageRef}
          >
            <AnimatePresence mode="wait">
              {showTitle ? (
                <motion.h2
                  key="experience-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-center text-primary-300"
                >
                  {title}
                </motion.h2>
              ) : (
                sentences.map((sentence, index) => {
                  const distance = Math.abs(index - currentSentenceIndex);
                  const blurAmount = distance * 2; // Adjust multiplier for desired blur intensity
                  const opacityAmount = 1 - (distance * 0.2); // Adjust multiplier for desired opacity fade

                  return (
                    <motion.p 
                      key={index} 
                      className={`text-2xl md:text-3xl font-sans leading-loose text-gray-200 text-center transition-all duration-500`}
                      style={{ 
                        filter: `blur(${blurAmount}px)`,
                        opacity: opacityAmount > 0 ? opacityAmount : 0.05, // Ensure minimum opacity for very distant sentences
                        // Apply bold only to the current sentence
                        fontWeight: index === currentSentenceIndex ? 'bold' : 'normal',
                        // Increase font size slightly for the current sentence for better focus
                        fontSize: index === currentSentenceIndex ? '2.5rem' : 'inherit', // Adjust size as needed
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {sentence.trim()}
                    </motion.p>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent via-black/70 z-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto flex items-center space-x-4 p-4 rounded-full bg-primary-900/80 shadow-lg">
          <ReactPlayer
            ref={playerRef}
            url={musicUrl}
            width="0px"
            height="0px"
            playing={isPlaying}
            muted={isMuted}
            volume={isMuted ? 0 : volume}
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
            className="text-white p-3.5 rounded-full bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform hover:scale-105"
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
            className="flex-grow h-2 rounded-lg appearance-none cursor-pointer range-lg bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 volume-slider"
            style={{ '--range-progress': `${(isMuted ? 0 : volume) * 100}%` } as React.CSSProperties}
          />

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white p-3.5 rounded-full bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform hover:scale-105"
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

        .volume-slider::-webkit-slider-runnable-track {
          background: linear-gradient(to right, var(--player-button-color) var(--range-progress), #6b7280 var(--range-progress));
          border-radius: 9999px;
        }

        .volume-slider::-moz-range-track {
          background: linear-gradient(to right, var(--player-button-color) var(--range-progress), #6b7280 var(--range-progress));
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
} 