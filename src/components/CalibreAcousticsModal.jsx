import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, Activity, ShieldAlert, Disc } from 'lucide-react';

export default function CalibreAcousticsModal({
  isOpen,
  onClose,
  product = null,
  lang = 'ar',
  t = null
}) {
  const isAr = lang === 'ar';

  const [isPlaying, setIsPlaying] = useState(false);
  const [calibreMode, setCalibreMode] = useState('28800'); // '28800' | 'tourbillon' | 'smooth'
  const [activeBeat, setActiveBeat] = useState(false);

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Escapement sound synthesizer using Web Audio API
  const playTickSound = (mode) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (mode === '28800') {
        // Crisp dual metallic escapement tick
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(3200, now);
        osc1.frequency.exponentialRampToValueAtTime(800, now + 0.025);

        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.03);

        // Secondary subtle spring resonance
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1400, now + 0.008);
        osc2.frequency.exponentialRampToValueAtTime(400, now + 0.035);

        gain2.gain.setValueAtTime(0.15, now + 0.008);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.008);
        osc2.stop(now + 0.04);

      } else if (mode === 'tourbillon') {
        // Harmonic cage rotation & deep resonance
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);

      } else if (mode === 'smooth') {
        // Delicate continuous micro-whisper
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4500, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.015);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
      }

      // Trigger visualizer pulse
      setActiveBeat(prev => !prev);

    } catch (err) {
      console.warn('Audio synthesis error:', err);
    }
  };

  // Start / Stop Interval Loop
  useEffect(() => {
    if (isPlaying) {
      // 28,800 VPH = 8 beats/sec = 125ms interval
      // Tourbillon = 6 beats/sec = 166ms interval
      // Smooth = 16 beats/sec = 62.5ms interval
      const intervalMs = calibreMode === '28800' ? 125 : calibreMode === 'tourbillon' ? 166 : 65;

      // First initial beat
      playTickSound(calibreMode);

      intervalRef.current = setInterval(() => {
        playTickSound(calibreMode);
      }, intervalMs);

    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, calibreMode]);

  // Clean stop when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.suspend();
      }
    }
  }, [isOpen]);

  // Accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  const handleModeChange = (mode) => {
    setCalibreMode(mode);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calibre-acoustics-title"
    >
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-6 bg-[#0c0f17]/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-30 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-neutral-800 text-start space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Activity className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-widest">
              {isAr ? 'الصوتيات والتردد الميكانيكي' : 'Acoustic Escapement'}
            </span>
          </div>
          <h2 id="calibre-acoustics-title" className="text-xl sm:text-2xl font-black text-white font-luxury-title">
            {t?.calibre?.title || 'مشغل نبضات المحركات الميكانيكية'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {t?.calibre?.subtitle || 'استمع للتكتكة السويسرية وتردد التروس الميكانيكية الدقيقة.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Simulated Movement Visualizer Dial */}
          <div className="relative h-56 rounded-2xl bg-linear-to-b from-[#141824] to-[#0a0c12] border border-neutral-800/80 flex flex-col items-center justify-center p-6 overflow-hidden">
            
            {/* Background rotating balance wheel outline */}
            <div 
              className={`absolute w-44 h-44 rounded-full border border-dashed border-amber-500/20 transition-all duration-300 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: calibreMode === 'smooth' ? '2s' : '4s' }}
            ></div>

            {/* Central Escapement Wheel */}
            <div className={`relative w-24 h-24 rounded-full bg-linear-to-b from-[#1c2230] to-[#0d1017] border-2 border-amber-400/80 shadow-[0_0_35px_rgba(212,175,55,0.3)] flex items-center justify-center transition-transform duration-100 ${
              isPlaying && activeBeat ? 'scale-105' : 'scale-100'
            }`}>
              <Disc className={`w-12 h-12 text-amber-400 transition-transform ${isPlaying ? 'rotate-180' : ''}`} />
              
              {/* Central Ruby Bearing jewel */}
              <div className="absolute w-3 h-3 rounded-full bg-rose-500 border border-rose-300 shadow-md"></div>
            </div>

            {/* Waveform Frequency Bars */}
            <div className="flex items-center gap-1.5 pt-6 h-12">
              {[12, 24, 40, 60, 85, 100, 75, 50, 30, 18, 45, 70, 90, 65, 35, 15].map((heightPct, idx) => {
                const activeHeight = isPlaying 
                  ? Math.max(15, (heightPct * (activeBeat ? 0.9 : 0.4))) 
                  : 8;
                return (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isPlaying ? 'bg-linear-to-t from-amber-600 to-amber-300' : 'bg-neutral-800'
                    }`}
                    style={{ height: `${activeHeight}%` }}
                  ></div>
                );
              })}
            </div>

            {/* Live Frequency Tag */}
            <div className="absolute bottom-3 text-[10px] text-neutral-400 font-mono">
              {isPlaying 
                ? (calibreMode === '28800' ? '4.0 Hz • 28,800 VPH • ESCAPEMENT ACTIVE' : calibreMode === 'tourbillon' ? '3.0 Hz • 21,600 VPH • TOURBILLON ROTATING' : 'SPRING DRIVE • CONTINUOUS SWEEP')
                : (isAr ? 'اضغط تشغيل للاستماع لنبضات المحرك' : 'Press play to initiate acoustics')}
            </div>

          </div>

          {/* Mode Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            
            <button
              type="button"
              onClick={() => handleModeChange('28800')}
              className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                calibreMode === '28800'
                  ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-sm'
                  : 'border-neutral-800 bg-[#12151e] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{t?.calibre?.mode28800 || 'Hi-Beat 28,800 VPH'}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">{isAr ? 'المعيار السويسري الكلاسيكي' : 'Standard Swiss Calibre'}</div>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('tourbillon')}
              className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                calibreMode === 'tourbillon'
                  ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-sm'
                  : 'border-neutral-800 bg-[#12151e] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{t?.calibre?.modeTourbillon || 'Tourbillon Escapement'}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">{isAr ? 'قفص التوربيون الفلكي' : 'Gravity Compensation'}</div>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('smooth')}
              className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                calibreMode === 'smooth'
                  ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-sm'
                  : 'border-neutral-800 bg-[#12151e] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{t?.calibre?.modeSmooth || 'Smooth Sweep'}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">{isAr ? 'حركة انسيابية صامتة' : 'Ultra-Glide Spring Motion'}</div>
            </button>

          </div>

          {/* Master Play / Pause Action CTA */}
          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={togglePlayback}
              className={`px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl cursor-pointer ${
                isPlaying
                  ? 'bg-neutral-800 text-amber-400 border border-amber-400/50 hover:bg-neutral-700'
                  : 'btn-gold shadow-amber-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{t?.calibre?.pause || 'إيقاف الصوت مؤقتاً'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t?.calibre?.play || 'تشغيل نبضات المحرك'}</span>
                </>
              )}
            </button>
          </div>

          {/* Mandatory Simulator Disclaimer Note */}
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2 text-start">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{t?.calibre?.disclaimer || 'محاكاة صوتية وترددية دقيقة لحركة التروس الميكانيكية (Simulated Mechanical Movement Sounds)'}</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 pt-0 flex items-center justify-end">
          <button
            onClick={onClose}
            className="btn-outline-gold px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
