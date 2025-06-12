'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import RecordRTC from 'recordrtc';

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
  const SENTENCE_DURATION_MS = 5000; // 5 seconds
  const [isRecording, setIsRecording] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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
          
          // Convert Spotify URL to YouTube URL if needed via API
          if (data.musicUrl.includes('spotify.com')) {
            const convertResponse = await fetch(`/api/convert-music?spotifyUrl=${encodeURIComponent(data.musicUrl)}`);
            if (convertResponse.ok) {
              const convertedData = await convertResponse.json();
              data.musicUrl = convertedData.youtubeUrl;
            } else {
              console.error('Failed to convert Spotify URL via API');
              // Fallback to a default YouTube music video if conversion fails
              data.musicUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            }
          }
          
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
    if (!messageRef.current || sentences.length === 0) return;

    const container = messageRef.current;
    const sentenceElements = Array.from(container.children) as HTMLElement[];

    if (sentenceElements.length === 0) return;

    // Scroll the container to keep the current sentence visible
    const currentSentenceElement = sentenceElements[currentSentenceIndex];
    if (currentSentenceElement) {
      currentSentenceElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentSentenceIndex, sentences]); // Dependency array for scrolling

  useEffect(() => {
    if (!messageRef.current || sentences.length === 0) return;

    const container = messageRef.current;
    const durationPerSentence = SENTENCE_DURATION_MS; 

    let startTime: DOMHighResTimeStamp | null = null;
    let currentSentenceEndTime: number = 0;

    const animateScroll = (currentTime: DOMHighResTimeStamp) => {
      if (!startTime) {
        startTime = currentTime;
        currentSentenceEndTime = startTime + durationPerSentence;
      }

      if (currentTime >= currentSentenceEndTime) {
        setCurrentSentenceIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % sentences.length;
          currentSentenceEndTime = currentTime + durationPerSentence;
          return nextIndex;
        });
      }

      animationFrameIdRef.current = requestAnimationFrame(animateScroll);
    };

    animationFrameIdRef.current = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameIdRef.current as number);
  }, [sentences]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experience-${id}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
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
    <div className="min-h-screen bg-stone-950 text-white relative flex flex-col items-center justify-center overflow-hidden">
      {backgroundPhotos.length > 0 && (
        <div className="fixed inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBackgroundPhotoIndex}
              src={backgroundPhotos[currentBackgroundPhotoIndex] || ''}
              alt="Background"
              className="w-full h-full object-cover opacity-10 transition-opacity duration-1000"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
        </div>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center p-4 lg:p-8 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 min-h-[calc(100vh-100px)] pt-24">
        
        <div className="w-full flex justify-center items-center lg:col-span-1">
          {photos.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex]}
                alt="Experience Photo"
                className="rounded-2xl shadow-xl w-full object-contain transition-all duration-300 ease-in-out"
                style={{ 
                  maxWidth: 'min(calc(100vw - 64px), 600px)',
                  maxHeight: 'min(calc(100vh - 200px), 600px)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          )}
        </div>

        <div className="w-full flex flex-col items-center justify-center lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="message-scroll-container max-w-3xl mx-auto px-10 py-14 bg-black/60 rounded-xl relative overflow-y-auto backdrop-blur-sm"
            style={{ 
              minHeight: '250px',
              height: 'auto',
              maxHeight: 'min(calc(100vh - 250px), 600px)',
              willChange: 'transform'
            }}
            ref={messageRef}
          >
            {sentences.map((sentence, index) => {
              const distance = Math.abs(index - currentSentenceIndex);
  
              return (
                <p 
                  key={index} 
                  className={`font-sans text-gray-200 text-center`}
                  style={{ 
                    fontWeight: index === currentSentenceIndex ? 'bold' : 'normal',
                    fontSize: index === currentSentenceIndex ? '1.875rem' : '1rem',
                    lineHeight: '1.4',
                    minHeight: '42px',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    opacity: index === currentSentenceIndex ? 1 : 0.4,
                    transition: 'opacity 0.3s ease-out' // Smooth opacity transition
                  }}
                >
                  {sentence.trim()}
                </p>
              );
            })}
          </motion.div>
        </div>
      </div>
  
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-center p-4">
        <h1 className="text-6xl font-bold text-center text-pink-400 drop-shadow-lg leading-tight tracking-wide">
          {title}
        </h1>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-0 z-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl mx-auto flex items-center space-x-4 p-2 rounded-full shadow-xl">
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
              soundcloud: { options: { auto_play: true } }
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
              className="w-24 h-1.5 rounded-full appearance-none cursor-pointer range-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 volume-slider"
              style={{
                background: `linear-gradient(to right, #1DB954 ${((isMuted ? 0 : volume) * 100)}%, #52525B ${((isMuted ? 0 : volume) * 100)}%)`,
                '--thumb-color': '#1DB954'
              } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white"
        >
          {isRecording ? 'Stop Recording' : 'Record Experience'}
        </button>
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
          background: var(--thumb-color); /* Use CSS variable */
          cursor: pointer;
          margin-top: -1px; /* Center thumb vertically */
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--thumb-color); /* Use CSS variable */
          cursor: pointer;
        }
      `}</style>
    </div>
  );
} 