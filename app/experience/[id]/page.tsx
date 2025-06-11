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
  const [musicProgress, setMusicProgress] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const animationFrameIdRef = useRef<number>();
  const params = useParams();
  const id = params?.id as string;
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
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
    if (!messageRef.current || !isPlaying || sentences.length === 0) return;

    const container = messageRef.current;
    const sentenceElements = Array.from(container.children) as HTMLElement[];

    if (sentenceElements.length === 0) return;

    const durationPerSentence = SENTENCE_DURATION_MS; 

    let startTime: DOMHighResTimeStamp | null = null;
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
          if (nextIndex === 0 && prevIndex === sentences.length - 1) {
            // If we've looped back to the first sentence after completing all sentences
            setHasCompletedFirstCycle(true); // Mark that the first cycle is complete
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

      animationFrameIdRef.current = requestAnimationFrame(animateScroll);
    };

    animationFrameIdRef.current = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameIdRef.current as number);
  }, [sentences, isPlaying, currentSentenceIndex]);

  useEffect(() => {
    if (!isPlaying && musicDuration > 0 && playerRef.current) {
      // This effect runs when music is paused or duration is available. Used to re-align if needed.
      // If music is paused, ensure text doesn't scroll.
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
  }, [isPlaying, musicDuration]);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgress = (state: { playedSeconds: number; }) => {
    setPlayedSeconds(state.playedSeconds);
    if (musicDuration > 0) {
      setMusicProgress(state.playedSeconds / musicDuration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const progress = x / width;
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().currentTime = progress * musicDuration;
    }
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
        {/* Title and sub-title at top right */}
        <div className="absolute top-8 right-8 text-right z-20">
          <p className="text-4xl font-playfair text-pink-300 drop-shadow-lg">Sempre Juntos</p>
          <p className="text-lg font-sans text-gray-300 mt-1">Nossa História</p>
        </div>

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
            className="message-scroll-container max-w-3xl mx-auto px-8 py-12 bg-black/60 rounded-xl relative overflow-y-auto"
            style={{ 
              minHeight: '250px',
              height: 'auto',
              maxHeight: 'min(calc(100vh - 250px), 600px)'
            }}
            ref={messageRef}
          >
            <AnimatePresence mode="wait">
              {sentences.map((sentence, index) => {
                const distance = Math.abs(index - currentSentenceIndex);
  
                return (
                  <motion.p 
                    key={index} 
                    className={`font-sans leading-relaxed text-gray-200 text-center`}
                    style={{ 
                      fontWeight: index === currentSentenceIndex ? 'bold' : 'normal',
                      fontSize: index === currentSentenceIndex ? '3.25rem' : '2.25rem', // Slightly larger font sizes
                      lineHeight: index === currentSentenceIndex ? '1.2' : '1.4', // Adjust line height for better spacing
                      transition: 'all 0.5s ease-out' // Smoother transition for all properties
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {sentence.trim()}
                  </motion.p>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {hasCompletedFirstCycle && (
          <motion.div
            key="title-display"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed bottom-[110px] left-0 right-0 z-30 flex justify-center p-4"
          >
            <h2 className="text-6xl font-bold text-center text-pink-400 drop-shadow-lg leading-tight tracking-wide">
              {title}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900/90 z-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl mx-auto flex items-center space-x-4 p-3 rounded-full bg-zinc-800 shadow-xl">
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
            onProgress={handleProgress}
            config={{
              youtube: { playerVars: { autoplay: 1 } },
              vimeo: { playerOptions: { autoplay: true } },
              soundcloud: { options: { auto_play: true } },
            }}
          />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white p-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform hover:scale-105 flex-shrink-0"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>

          <div className="flex-grow flex items-center space-x-2">
            <span className="text-gray-400 text-sm flex-shrink-0">{formatTime(playedSeconds)}</span>
            <div className="flex-grow relative h-1.5 bg-zinc-700 rounded-full overflow-hidden cursor-pointer" onClick={handleProgressBarClick}>
              <div 
                className="progress-bar-fill h-full bg-[#1DB954] rounded-full absolute top-0 left-0"
                style={{ width: `${musicProgress * 100}%` }}
              ></div>
            </div>
            <span className="text-gray-400 text-sm flex-shrink-0">{formatTime(musicDuration)}</span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform hover:scale-105"
            >
              {isMuted || volume === 0 ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 rounded-full appearance-none cursor-pointer range-sm bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 volume-slider"
              style={{
                '--range-progress': `${(isMuted ? 0 : volume) * 100}%`,
                '--track-color': '#52525B',
                '--thumb-color': '#1DB954'
              } as React.CSSProperties}
            />
          </div>
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

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          margin-top: -1px; /* Center thumb vertically */
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #1DB954 var(--range-progress), #555 var(--range-progress)); /* Spotify green */
            border-radius: 9999px;
        }

        .volume-slider::-moz-range-track {
            background: linear-gradient(to right, #1DB954 var(--range-progress), #555 var(--range-progress)); /* Spotify green */
            border-radius: 9999px;
        }

        /* Custom progress bar styles */
        .progress-bar-container {
            width: 100%;
            height: 4px;
            background-color: #555; /* Dark gray for background */
            border-radius: 2px;
            margin-top: 8px; /* Space between controls and progress bar */
        }

        .progress-bar-fill {
            height: 100%;
            background-color: #1DB954; /* Spotify green */
            border-radius: 2px;
            transition: width 0.1s linear; /* Smooth progress */
        }
      `}</style>
    </div>
  );
} 