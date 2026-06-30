// ========================
// Timer Manager
// ========================

/**
 * Manages all timers and intervals for a game instance.
 * Provides centralized cleanup to prevent memory leaks.
 */
export class TimerManager {
  private timers: Set<ReturnType<typeof setTimeout>> = new Set();
  private intervals: Set<ReturnType<typeof setInterval>> = new Set();

  /**
   * Starts a countdown that ticks every second.
   * Calls onTick(remaining) each second, then onComplete() when done.
   */
  startCountdown(
    seconds: number,
    onTick: (remaining: number) => void,
    onComplete: () => void,
  ): void {
    let remaining = seconds;

    // Fire the first tick immediately
    onTick(remaining);

    const interval = setInterval(() => {
      remaining--;

      if (remaining <= 0) {
        clearInterval(interval);
        this.intervals.delete(interval);
        onComplete();
      } else {
        onTick(remaining);
      }
    }, 1000);

    this.intervals.add(interval);
  }

  /**
   * Starts a recurring interval. Stores and returns the interval reference.
   */
  startInterval(
    ms: number,
    callback: () => void,
  ): ReturnType<typeof setInterval> {
    const interval = setInterval(callback, ms);
    this.intervals.add(interval);
    return interval;
  }

  /**
   * Starts a one-shot timeout. Stores and returns the timeout reference.
   */
  startTimeout(
    ms: number,
    callback: () => void,
  ): ReturnType<typeof setTimeout> {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, ms);
    this.timers.add(timer);
    return timer;
  }

  /**
   * Clears all active timers and intervals, emptying both sets.
   */
  clearAll(): void {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
    this.timers.clear();

    for (const interval of this.intervals) {
      clearInterval(interval);
    }
    this.intervals.clear();
  }
}
