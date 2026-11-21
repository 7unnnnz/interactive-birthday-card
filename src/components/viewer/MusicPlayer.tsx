import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { birthdaySynth } from '../../utils/audioSynthesizer';

interface MusicPlayerProps {
  musicUrl?: string;
  autoPlay?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicUrl, autoPlay = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUsingSynth, setIsUsingSynth] = useState(false);

  useEffect(() => {
    // Khởi tạo audio element nếu có URL
    if (musicUrl && !audioRef.current) {
      const audio = new Audio();
      audio.src = musicUrl;
      audio.loop = true;
      audio.volume = 0.7;
      audio.crossOrigin = 'anonymous';

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);

      // Nếu link MP3 gặp lỗi mạng hoặc CORS, fallback mượt sang Web Audio Synth
      audio.onerror = () => {
        console.warn('Audio URL failed to load. Falling back to Birthday Synthesizer.');
        setIsUsingSynth(true);
        if (isPlaying) {
          birthdaySynth.play();
        }
      };

      audioRef.current = audio;
    }

    if (autoPlay) {
      handlePlay();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      birthdaySynth.stop();
    };
  }, [musicUrl, autoPlay]);

  const handlePlay = async () => {
    if (isUsingSynth || !musicUrl) {
      setIsUsingSynth(true);
      birthdaySynth.play();
      setIsPlaying(true);
      return;
    }

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio play error, falling back to Web Audio Synthesizer:', err);
        setIsUsingSynth(true);
        birthdaySynth.play();
        setIsPlaying(true);
      }
    } else {
      setIsUsingSynth(true);
      birthdaySynth.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    birthdaySynth.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  return (
    <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
      <button
        onClick={togglePlay}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full glass-panel text-white hover:text-gold-300 shadow-xl border border-white/15 hover:border-gold-400/40 transition-all cursor-pointer group active:scale-95"
        title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền'}
      >
        {isPlaying ? (
          <>
            <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
              <span className="w-1 bg-gold-400 rounded-full animate-soundwave-1" />
              <span className="w-1 bg-rose-400 rounded-full animate-soundwave-2" />
              <span className="w-1 bg-gold-300 rounded-full animate-soundwave-3" />
            </div>
            <Volume2 className="w-4 h-4 text-gold-400" />
          </>
        ) : (
          <>
            <Music className="w-4 h-4 text-slate-400 group-hover:text-gold-300" />
            <VolumeX className="w-4 h-4 text-slate-400" />
          </>
        )}
        <span className="text-xs font-medium hidden sm:inline">
          {isPlaying ? (isUsingSynth ? 'Chimes Melodic' : 'Đang phát') : 'Tắt nhạc'}
        </span>
      </button>
    </div>
  );
};
