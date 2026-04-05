import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(sec: number) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause(); else audio.play();
    setPlaying(!playing);
  }, [playing]);

  const seek = useCallback((val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = val[0];
    setCurrentTime(val[0]);
  }, []);

  const skip = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
  }, []);

  const cycleSpeed = useCallback(() => {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [speed]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) audioRef.current.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  const changeVolume = useCallback((val: number[]) => {
    const v = val[0];
    setVolume(v);
    if (audioRef.current) { audioRef.current.volume = v; audioRef.current.muted = false; }
    setMuted(false);
  }, []);

  return (
    <div className="w-full space-y-3">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Progress bar */}
      <div className="space-y-1">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={seek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => skip(-15)}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={togglePlay}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => skip(15)}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed */}
          <button
            onClick={cycleSpeed}
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-md transition-colors",
              "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            {speed}x
          </button>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[muted ? 0 : volume]}
              max={1}
              step={0.05}
              onValueChange={changeVolume}
              className="w-20 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
