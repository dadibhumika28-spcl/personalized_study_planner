import React, { useState, useEffect, useRef } from 'react';
import { StudySession, SUBJECT_COLORS, SUBJECT_LIST } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Timer,
  Coffee,
  CheckCircle,
  Award,
  BookOpen,
  FastForward,
  Info
} from 'lucide-react';

interface PomodoroViewProps {
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  incrementXP: (xp: number) => void;
  incrementStreak: () => void;
}

export default function PomodoroView({
  sessions,
  setSessions,
  incrementXP,
  incrementStreak,
}: PomodoroViewProps) {
  // Modes: focus, short_break, long_break
  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [isActive, setIsActive] = useState(false);
  
  // Custom Timer settings states
  const [focusSetting, setFocusSetting] = useState(25);
  const [shortSetting, setShortSetting] = useState(5);
  const [longSetting, setLongSetting] = useState(15);

  // Core countdown seconds state
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  
  // Active selected subject
  const [activeSubject, setActiveSubject] = useState('Computer Science');
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);

  // Sound alert preference
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer Ref
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize timer limits whenever settings or mode changes
  useEffect(() => {
    resetTimer();
  }, [mode, focusSetting, shortSetting, longSetting]);

  // Audio helper (synthesized audio beep since browser media files may not load on standard previews)
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("AudioContext block pre-interaction limit: ", e);
    }
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (mode === 'focus') {
      setSecondsRemaining(focusSetting * 60);
    } else if (mode === 'short_break') {
      setSecondsRemaining(shortSetting * 60);
    } else {
      setSecondsRemaining(longSetting * 60);
    }
  };

  const skipTimer = () => {
    // Manually trigger finish
    handleTimerComplete();
  };

  // Complete loop trigger
  const handleTimerComplete = () => {
    playBeep();
    pauseTimer();

    if (mode === 'focus') {
      // 1. Gain Rewards
      incrementXP(300); // Massive XP for finishing a full Pomodoro!
      incrementStreak(); // Streak multiplier check
      setSessionCompletedCount(prev => prev + 1);

      // 2. Automatically log a Study Session in Database list!
      const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const newSession: StudySession = {
        id: 'pomo_' + Date.now(),
        title: `Pomodoro Focus (${focusSetting}m)`,
        subject: activeSubject,
        durationMinutes: focusSetting,
        date: new Date().toISOString().split('T')[0],
        time: timeNow,
        type: 'pomodoro',
      };
      setSessions(prev => [newSession, ...prev]);

      // Shift to Short or Long Break based on sessions completed
      if ((sessionCompletedCount + 1) % 4 === 0) {
        setMode('long_break');
      } else {
        setMode('short_break');
      }
    } else {
      // Return to focus mode on break completion
      setMode('focus');
    }
  };

  // Interactive Tick loop
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimeout(() => handleTimerComplete(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, mode, focusSetting, shortSetting, longSetting, sessionCompletedCount, activeSubject]);

  // Formatter for timer dial
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine current limits
  const totalLimitSeconds = mode === 'focus' ? focusSetting * 60 : mode === 'short_break' ? shortSetting * 60 : longSetting * 60;
  const ratio = Math.max(secondsRemaining / totalLimitSeconds, 0);

  // SVG parameters
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ratio * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 animate-fade-in">
      
      {/* LEFT MODULE: Primary countdown timer (Span 8 cols) */}
      <div className="lg:col-span-8 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 p-8 rounded-3xl shadow-sm space-y-8 flex flex-col items-center justify-center">
        
        {/* Tab mode selection */}
        <div className="flex bg-white/50 dark:bg-slate-800/30 p-1.5 rounded-2xl w-fit border border-white/40 dark:border-slate-800/20 shadow-xs">
          {([
            { id: 'focus', label: '📖 Focus Session', theme: 'text-indigo-600' },
            { id: 'short_break', label: '☕ Short Break', theme: 'text-teal-600' },
            { id: 'long_break', label: '🌴 Long Break', theme: 'text-purple-600' },
          ] as const).map((block) => (
            <button
              key={block.id}
              onClick={() => setMode(block.id)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                mode === block.id 
                  ? 'bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-slate-700/60 shadow-sm text-[#4F46E5] dark:text-indigo-400' 
                  : 'text-slate-505 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{block.label}</span>
            </button>
          ))}
        </div>

        {/* Circular Dial timer representation */}
        <div className="relative flex items-center justify-center select-none">
          <svg className="w-64 h-64 transform -rotate-95">
            {/* Background ring */}
            <circle
              className="text-slate-100 dark:text-slate-800/80"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="128"
              cy="128"
            />
            {/* Foreground progress path */}
            <circle
              className={`transition-all duration-300 ${
                mode === 'focus' 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : mode === 'short_break' 
                  ? 'text-teal-555 dark:text-teal-400' 
                  : 'text-purple-605'
              }`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="128"
              cy="128"
            />
          </svg>

          {/* Time digits */}
          <div className="absolute text-center space-y-1 bg-transparent">
            <h2 className="text-4xl font-extrabold tracking-widest text-slate-800 dark:text-white font-mono">
              {formatTime(secondsRemaining)}
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
              {mode.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Interaction controls */}
        <div className="flex items-center space-x-4">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Disable Alert Sound' : 'Enable Alert Sound'}
            className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-400 hover:text-slate-700 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-indigo-501" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>

          {/* Play / pause */}
          {!isActive ? (
            <button
              onClick={startTimer}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-3xl tracking-wide shadow-lg shadow-indigo-150 dark:shadow-none animate-pulse-subtle"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>START ROUND</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-black px-8 py-4 rounded-3xl tracking-wide shadow-lg"
            >
              <Pause className="h-5 w-5 fill-current" />
              <span>PAUSE</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={resetTimer}
            title="Reset Countdown"
            className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-400 hover:text-slate-700 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Skip round */}
          {isActive && (
            <button
              onClick={skipTimer}
              title="Skip Countdown Round"
              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-2xl transition-colors"
            >
              <FastForward className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Focus subject dropdown selector */}
        {mode === 'focus' && (
          <div className="pt-2 flex items-center space-x-3 text-xs bg-slate-50 dark:bg-slate-850 px-4 py-2.5 rounded-2xl border border-slate-150/40 dark:border-slate-850/50">
            <BookOpen className="h-4 w-4 text-indigo-505" />
            <span className="text-slate-400 font-semibold">Focus subject:</span>
            <select
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value)}
              className="bg-transparent border-0 text-indigo-650 dark:text-indigo-400 font-bold focus:outline-none p-0 focus:ring-0"
            >
              {SUBJECT_LIST.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* RIGHT MODULE: Slider Controls for customization (Span 4 cols) */}
      <div className="lg:col-span-4 bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
        
        <div className="space-y-6">
          <div className="pb-3 border-b border-slate-150/30 dark:border-slate-800/20">
            <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Timer className="h-4 w-4 text-indigo-505" />
              <span>Interval Configuration</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
            Customize focus block duration and break periods to match your personal study tolerance.
          </p>

          {/* Slider 1: Focus Setting */}
          <div className="space-y-1.5 pt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-650 dark:text-slate-350">📖 Focus Duration</span>
              <span className="font-mono font-extrabold text-indigo-604 dark:text-indigo-400">{focusSetting} Minutes</span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={5}
              value={focusSetting}
              disabled={isActive}
              onChange={(e) => {
                setFocusSetting(Number(e.target.value));
              }}
              className="w-full accent-indigo-600 disabled:opacity-40 cursor-pointer"
            />
          </div>

          {/* Slider 2: Short Setting */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-650 dark:text-slate-350">☕ Short Break</span>
              <span className="font-mono font-extrabold text-teal-605 dark:text-teal-400">{shortSetting} Minutes</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={shortSetting}
              disabled={isActive}
              onChange={(e) => setShortSetting(Number(e.target.value))}
              className="w-full accent-teal-500 disabled:opacity-40 cursor-pointer"
            />
          </div>

          {/* Slider 3: Long Setting */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-650 dark:text-slate-350">🌴 Long Break</span>
              <span className="font-mono font-extrabold text-purple-605 dark:text-purple-400">{longSetting} Minutes</span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              step={5}
              value={longSetting}
              disabled={isActive}
              onChange={(e) => setLongSetting(Number(e.target.value))}
              className="w-full accent-purple-600 disabled:opacity-40 cursor-pointer"
            />
          </div>
        </div>

        {/* Productivity incentive card */}
        <div className="bg-white/60 dark:bg-slate-800/30 p-4 rounded-2xl border border-white/50 dark:border-slate-800/30 max-w-full space-y-2 mt-8 shadow-xs">
          <div className="flex items-center space-x-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-bold">
            <Award className="h-4 w-4 animate-bounce" />
            <span>Study rewards active</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
            Successfully completing a full focus timer grants <span className="font-bold text-indigo-605">300 XP</span> and expands your weekly tracker!
          </p>
        </div>

      </div>

    </div>
  );
}
