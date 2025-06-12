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
  layout: string;
}

// Default Layout Component
function Default_Layout({
  photos,
  messageRef,
  sentences,
  currentSentenceIndex,
  currentPhotoIndex,
  title,
}: {
  photos: string[];
  messageRef: React.RefObject<HTMLDivElement>;
  sentences: string[];
  currentSentenceIndex: number;
  currentPhotoIndex: number;
  title: string;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-primary-400 mb-8 text-center drop-shadow-lg font-playfair">
        {title}
      </h1>

      {photos.length > 0 && (
        <div className="relative w-full max-w-xl h-96 rounded-lg shadow-2xl overflow-hidden mb-8 transform transition-all duration-500 ease-in-out hover:scale-105">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhotoIndex}
              src={photos[currentPhotoIndex] || ''}
              alt="Experience Photo"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      )}

      <div
        ref={messageRef}
        className="message-scroll-container w-full max-w-2xl bg-black/50 p-6 rounded-lg shadow-xl text-center text-lg leading-relaxed max-h-60 overflow-y-auto custom-scrollbar"
      >
        {sentences.map((sentence, index) => (
          <p
            key={index}
            className={`transition-opacity duration-500 ${
              index === currentSentenceIndex
                ? 'text-white opacity-100 font-semibold'
                : 'text-gray-400 opacity-70'
            }`}
          >
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
}

// Full Screen Photo Layout Component
function Full_Screen_Photo_Layout({
  photos,
  sentences,
  currentSentenceIndex,
  title,
  messageRef,
}: {
  photos: string[];
  sentences: string[];
  currentSentenceIndex: number;
  title: string;
  messageRef: React.RefObject<HTMLDivElement>;
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) =>
          prev === photos.length - 1 ? 0 : prev + 1
        );
      }, 5000); // Change photo every 5 seconds

      return () => clearInterval(interval);
    } else if (photos.length === 1) {
      setCurrentPhotoIndex(0);
    }
  }, [photos]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden">
      {photos.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhotoIndex}
            src={photos[currentPhotoIndex] || ''}
            alt="Full Screen Photo"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      )}
      
      {/* Overlay for text and title */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-end p-8 text-center">
        {/* Title is removed from here to avoid duplication */}
        <div 
          ref={messageRef}
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl max-w-lg mb-20 shadow-lg border border-white/20 message-scroll-container max-h-60 overflow-y-auto custom-scrollbar">
          {sentences.map((sentence, index) => (
            <p
              key={index}
              className={`text-lg leading-relaxed transition-opacity duration-500 ${
                index === currentSentenceIndex
                  ? 'text-white opacity-100 font-semibold'
                  : 'text-gray-200 opacity-70'
              }`}
            >
              {sentence}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// New Layout 1: Centered Message Layout
function Centered_Message_Layout({
  photos,
  messageRef,
  sentences,
  currentSentenceIndex,
  title,
}: {
  photos: string[];
  messageRef: React.RefObject<HTMLDivElement>;
  sentences: string[];
  currentSentenceIndex: number;
  title: string;
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) =>
          prev === photos.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    } else if (photos.length === 1) {
      setCurrentPhotoIndex(0);
    }
  }, [photos]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-4">
      <h1 className="text-5xl font-bold text-primary-400 mb-8 text-center drop-shadow-lg font-playfair">
        {title}
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl">
        {photos.length > 0 && (
          <div className="relative w-48 h-48 rounded-full shadow-2xl overflow-hidden flex-shrink-0 animate-spin-slow">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex] || ''}
                alt="Experience Photo"
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
          </div>
        )}

        <div
          ref={messageRef}
          className="message-scroll-container bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg text-center text-lg leading-relaxed max-h-60 overflow-y-auto custom-scrollbar flex-grow"
        >
          {sentences.map((sentence, index) => (
            <p
              key={index}
              className={`transition-opacity duration-500 ${
                index === currentSentenceIndex
                  ? 'text-white opacity-100 font-semibold'
                  : 'text-gray-300 opacity-70'
              }`}
            >
              {sentence}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// New Layout 2: Split Screen Layout
function Split_Screen_Layout({
  photos,
  messageRef,
  sentences,
  currentSentenceIndex,
  currentPhotoIndex,
  title,
}: {
  photos: string[];
  messageRef: React.RefObject<HTMLDivElement>;
  sentences: string[];
  currentSentenceIndex: number;
  currentPhotoIndex: number;
  title: string;
}) {
  return (
    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center h-full w-full">
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden">
        {photos.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhotoIndex}
              src={photos[currentPhotoIndex] || ''}
              alt="Experience Photo"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
        )}
      </div>

      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col items-center justify-center p-8 bg-black/60">
        <h1 className="text-4xl font-bold text-white mb-6 text-center drop-shadow-lg font-playfair">
          {title}
        </h1>
        <div
          ref={messageRef}
          className="message-scroll-container w-full max-w-lg bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center text-lg leading-relaxed max-h-60 overflow-y-auto custom-scrollbar"
        >
          {sentences.map((sentence, index) => (
            <p
              key={index}
              className={`transition-opacity duration-500 ${
                index === currentSentenceIndex
                  ? 'text-white opacity-100 font-semibold'
                  : 'text-gray-300 opacity-70'
              }`}
            >
              {sentence}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// New Layout 3: Vertical Timeline Layout
function Vertical_Timeline_Layout({
  photos,
  message,
  sentences,
  currentSentenceIndex,
  title,
  messageRef,
}: {
  photos: string[];
  message: string;
  sentences: string[];
  currentSentenceIndex: number;
  title: string;
  messageRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={messageRef} className="relative z-10 flex flex-col items-center justify-start h-full w-full p-8 overflow-y-auto custom-scrollbar">
      <h1 className="text-5xl font-bold text-primary-400 mb-12 text-center drop-shadow-lg font-playfair">
        {title}
      </h1>
      <div className="relative w-full max-w-2xl">
        {sentences.map((sentence, index) => (
          <div key={index} className="mb-12 flex items-start w-full">
            <div className="flex flex-col items-center mr-6">
              <div className="w-4 h-4 bg-primary-500 rounded-full flex-shrink-0 z-10"></div>
              {index < sentences.length - 1 && (
                <div className="w-0.5 h-full bg-primary-500 my-2"></div>
              )}
            </div>
            <div className="flex-grow">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`bg-white/10 backdrop-blur-md p-5 rounded-lg shadow-lg border border-white/20 text-lg leading-relaxed transition-all duration-500 ${
                  index === currentSentenceIndex
                    ? 'text-white opacity-100 scale-100'
                    : 'text-gray-300 opacity-70 scale-95'
                }`}
              >
                <p>{sentence}</p>
                {photos[index] && (
                  <AnimatePresence>
                    <motion.img
                      key={photos[index]}
                      src={photos[index]}
                      alt="Timeline Image"
                      className="mt-4 rounded-md w-full h-auto object-cover"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// New Layout 4: Photo Grid Message Layout
function Photo_Grid_Message_Layout({
  photos,
  messageRef,
  sentences,
  currentSentenceIndex,
  title,
}: {
  photos: string[];
  messageRef: React.RefObject<HTMLDivElement>;
  sentences: string[];
  currentSentenceIndex: number;
  title: string;
}) {
  // Using a subset of photos for the grid to keep it manageable
  const gridPhotos = photos.slice(0, 9); // Max 9 photos for the grid

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-4">
      <h1 className="text-5xl font-bold text-primary-400 mb-8 text-center drop-shadow-lg font-playfair">
        {title}
      </h1>

      <div className="grid grid-cols-3 gap-2 w-full max-w-3xl h-96 overflow-hidden rounded-lg shadow-xl mb-8">
        {gridPhotos.map((photo, index) => (
          <motion.img
            key={index}
            src={photo || ''}
            alt={`Grid Photo ${index + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
          />
        ))}
      </div>

      <div
        ref={messageRef}
        className="message-scroll-container bg-black/50 p-6 rounded-lg shadow-xl text-center text-lg leading-relaxed max-h-60 overflow-y-auto custom-scrollbar w-full max-w-2xl"
      >
        {sentences.map((sentence, index) => (
          <p
            key={index}
            className={`transition-opacity duration-500 ${
              index === currentSentenceIndex
                ? 'text-white opacity-100 font-semibold'
                : 'text-gray-400 opacity-70'
            }`}
          >
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
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

          // No Spotify conversion needed, directly set the experience data
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
        setCurrentSentenceIndex((prevIndex) => {
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

  const handleProgress = (state: { playedSeconds: number }) => {
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
        audio: true,
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
          type: 'video/webm',
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
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  if (!experience) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { photos, message, musicUrl, backgroundPhotos = [], title, layout } = experience;

  return (
    <div className="min-h-screen bg-stone-950 text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Photos (always present) */}
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

      {/* Conditional Layout Rendering */}
      {layout === 'full_screen_photo' ? (
        <Full_Screen_Photo_Layout
          photos={photos}
          sentences={sentences}
          currentSentenceIndex={currentSentenceIndex}
          title={title}
          messageRef={messageRef}
        />
      ) : layout === 'centered_message' ? (
        <Centered_Message_Layout
          photos={photos}
          messageRef={messageRef}
          sentences={sentences}
          currentSentenceIndex={currentSentenceIndex}
          title={title}
        />
      ) : layout === 'split_screen' ? (
        <Split_Screen_Layout
          photos={photos}
          messageRef={messageRef}
          sentences={sentences}
          currentSentenceIndex={currentSentenceIndex}
          currentPhotoIndex={currentPhotoIndex}
          title={title}
        />
      ) : layout === 'vertical_timeline' ? (
        <Vertical_Timeline_Layout
          photos={photos}
          message={message}
          sentences={sentences}
          currentSentenceIndex={currentSentenceIndex}
          title={title}
          messageRef={messageRef}
        />
      ) : layout === 'photo_grid_message' ? (
        <Photo_Grid_Message_Layout
          photos={photos}
          messageRef={messageRef}
          sentences={sentences}
          currentSentenceIndex={currentSentenceIndex}
          title={title}
        />
      ) : (
        <Default_Layout
          photos={photos}
          messageRef={messageRef}
          sentences={sentences}
          currentSentenceIndex={currentSentenceIndex}
          currentPhotoIndex={currentPhotoIndex}
          title={title}
        />
      )}

      {/* Music Player (always present) */}
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
            <div
              className="flex-grow relative h-1.5 bg-zinc-700 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressBarClick}
            >
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

      {/* Recording Button (always present) */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white"
        >
          {isRecording ? 'Stop Recording' : 'Record Experience'}
        </button>
      </div>

      {/* Global Styles */}
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

        /* Custom animation for centered message layout */
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 