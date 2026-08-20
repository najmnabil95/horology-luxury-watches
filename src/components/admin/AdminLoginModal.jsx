import React, { useState, useEffect, useRef } from 'react';
import { Watch, Lock, ShieldCheck, Eye, EyeOff, AlertTriangle, X } from 'lucide-react';

// ============================================================
// Admin PIN/Password protection constants
// PIN is stored hashed in localStorage. Default PIN: 1234
// For production: change ADMIN_PIN_HASH below using:
//   btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_PIN')))))
// Or just override via VITE_ADMIN_PIN env var.
// ============================================================

const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

// Simple deterministic hash for client-side PIN comparison
// NOT cryptographic — real auth should use Supabase Auth.
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Configurable via env var or fallback to default dev PIN '1234'
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234';
const ADMIN_PIN_HASH = simpleHash(ADMIN_PIN);
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour session

export function isAdminSessionValid() {
  try {
    const session = JSON.parse(localStorage.getItem('horology_admin_session') || '{}');
    if (!session.hash || !session.expiresAt) return false;
    if (session.hash !== ADMIN_PIN_HASH) return false;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('horology_admin_session');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function setAdminSession() {
  localStorage.setItem('horology_admin_session', JSON.stringify({
    hash: ADMIN_PIN_HASH,
    expiresAt: Date.now() + SESSION_DURATION_MS
  }));
}

export function clearAdminSession() {
  localStorage.removeItem('horology_admin_session');
}

export default function AdminLoginModal({ isOpen, onSuccess, onClose, lang }) {
  const isAr = lang === 'ar';
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(() => {
    try {
      return parseInt(localStorage.getItem('horology_admin_attempts') || '0', 10);
    } catch { return 0; }
  });
  const [lockedUntil, setLockedUntil] = useState(() => {
    try {
      return parseInt(localStorage.getItem('horology_admin_locked_until') || '0', 10);
    } catch { return 0; }
  });
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockedUntil > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setCountdown(0);
          setLockedUntil(0);
          setAttempts(0);
          localStorage.removeItem('horology_admin_locked_until');
          localStorage.removeItem('horology_admin_attempts');
          clearInterval(interval);
        } else {
          setCountdown(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil]);

  if (!isOpen) return null;

  const isLocked = lockedUntil > Date.now();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (simpleHash(pin.trim()) === ADMIN_PIN_HASH) {
      // SUCCESS
      setAdminSession();
      setAttempts(0);
      localStorage.removeItem('horology_admin_attempts');
      localStorage.removeItem('horology_admin_locked_until');
      setError('');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('horology_admin_attempts', String(newAttempts));

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
        setLockedUntil(lockUntil);
        setCountdown(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        localStorage.setItem('horology_admin_locked_until', String(lockUntil));
        setError(isAr ? 'تم تجميد الوصول لمدة 5 دقائق بسبب كثرة المحاولات الخاطئة' : 'Access locked for 5 minutes due to too many failed attempts.');
      } else {
        setError(
          isAr
            ? `رمز المرور غير صحيح. المحاولات المتبقية: ${MAX_ATTEMPTS - newAttempts}`
            : `Incorrect PIN. Attempts remaining: ${MAX_ATTEMPTS - newAttempts}`
        );
      }
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-sm bg-[#0d1020] border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-[2px] mx-auto mb-5 shadow-lg shadow-amber-500/30">
          <div className="w-full h-full bg-[#0d0f17] rounded-[14px] flex items-center justify-center">
            <Watch className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        <h2 className="text-xl font-black text-white mb-1 font-serif-luxury tracking-wide">
          HOROLOGY ATELIER
        </h2>
        <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-6">
          {isAr ? 'البوابة الإدارية المحمية' : 'Secured Admin Portal'}
        </p>

        {/* Lock Icon */}
        <div className={`w-12 h-12 rounded-2xl mx-auto mb-5 flex items-center justify-center ${isLocked ? 'bg-rose-500/20 border border-rose-500/40' : 'bg-amber-500/15 border border-amber-500/30'}`}>
          {isLocked
            ? <AlertTriangle className="w-6 h-6 text-rose-400" />
            : <Lock className="w-6 h-6 text-amber-400" />
          }
        </div>

        {isLocked ? (
          <div className="space-y-3 py-4">
            <p className="text-rose-400 font-bold text-sm">{error}</p>
            <div className="text-4xl font-mono font-black text-rose-300">
              {Math.floor(countdown / 60).toString().padStart(2, '0')}:{(countdown % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-neutral-400">
              {isAr ? 'يُرجى الانتظار قبل المحاولة مرة أخرى' : 'Please wait before trying again'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-start">
              <label className="text-xs font-bold text-neutral-300 block">
                {isAr ? 'رمز الدخول الإداري (PIN)' : 'Admin Access PIN'}
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="••••"
                  inputMode="numeric"
                  autoComplete="current-password"
                  className="w-full text-center text-2xl font-mono tracking-widest font-bold bg-[#0a0d16] border border-neutral-700 focus:border-amber-400 rounded-xl p-3.5 text-amber-300 focus:outline-none placeholder-neutral-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && !isLocked && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {attempts > 0 && !isLocked && (
              <div className="w-full bg-neutral-800 rounded-full h-1.5">
                <div
                  className="bg-rose-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(attempts / MAX_ATTEMPTS) * 100}%` }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full btn-gold py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'دخول آمن' : 'Secure Login'}</span>
            </button>

            <p className="text-[10px] text-neutral-600">
              {isAr
                ? `يُقفل الحساب بعد ${MAX_ATTEMPTS} محاولات خاطئة لمدة 5 دقائق`
                : `Account locks after ${MAX_ATTEMPTS} failed attempts for 5 minutes`}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
