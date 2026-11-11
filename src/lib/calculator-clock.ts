/** A deterministic server snapshot keeps prerendered HTML safe to hydrate. */
export const serverClock = (): null => null;
export const clientClock = (): number => Math.floor(Date.now() / 30_000) * 30_000;
export function subscribeClock(callback: () => void): () => void {
  const timer = window.setInterval(callback, 30_000);
  window.addEventListener("focus", callback);
  document.addEventListener("visibilitychange", callback);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", callback);
    document.removeEventListener("visibilitychange", callback);
  };
}
