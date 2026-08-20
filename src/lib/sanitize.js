/**
 * Input Sanitization Utilities for Horology Luxury Watches
 * Lightweight, zero-dependency sanitizer for user-facing forms.
 * NOT a replacement for server-side validation — always validate on the backend too.
 */

/**
 * Sanitize a plain text string:
 * - Strips HTML tags
 * - Removes null bytes
 * - Trims whitespace
 * - Enforces max length
 */
export function sanitizeText(input = '', maxLength = 500) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')        // Strip HTML tags
    .replace(/\0/g, '')              // Remove null bytes
    .replace(/[^\S\n]+/g, ' ')      // Collapse multiple spaces (preserve newlines)
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(input = '') {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim().toLowerCase().slice(0, 254);
  // Basic email format check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : '';
}

/**
 * Sanitize a phone number — allow only digits, spaces, +, -, ()
 */
export function sanitizePhone(input = '') {
  if (typeof input !== 'string') return '';
  return input.replace(/[^\d\s+\-().]/g, '').trim().slice(0, 20);
}

/**
 * Sanitize a numeric value — returns number or 0 if invalid
 */
export function sanitizeNumber(input, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const n = Number(input);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, min), max);
}

/**
 * Sanitize a name (person or product name)
 * Allows letters (any script), spaces, hyphens, apostrophes
 */
export function sanitizeName(input = '', maxLength = 120) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"';&\\/\\\\]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Rate limiter factory — returns a function that checks if the action is allowed.
 * Uses localStorage to persist cooldown across component remounts.
 *
 * @param {string} key - Unique identifier for this rate-limited action
 * @param {number} maxAttempts - Max calls allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ check: () => boolean, remaining: () => number, reset: () => void }}
 */
export function createRateLimiter(key, maxAttempts = 3, windowMs = 60_000) {
  const storageKey = `rl_${key}`;

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{"count":0,"windowStart":0}');
    } catch {
      return { count: 0, windowStart: 0 };
    }
  }

  function saveState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  return {
    /**
     * Returns true if the action is allowed, false if rate-limited.
     * Call this before performing the action. If it returns true, the attempt is counted.
     */
    check() {
      const now = Date.now();
      const state = getState();
      const windowExpired = now - state.windowStart >= windowMs;

      if (windowExpired) {
        saveState({ count: 1, windowStart: now });
        return true;
      }

      if (state.count >= maxAttempts) {
        return false;
      }

      saveState({ count: state.count + 1, windowStart: state.windowStart });
      return true;
    },

    /** Returns seconds until rate limit resets */
    cooldownRemaining() {
      const now = Date.now();
      const state = getState();
      if (state.count < maxAttempts) return 0;
      const remaining = (state.windowStart + windowMs) - now;
      return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    },

    /** Manually reset the rate limiter */
    reset() {
      localStorage.removeItem(storageKey);
    }
  };
}
