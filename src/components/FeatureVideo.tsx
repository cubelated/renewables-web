import { Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type FeatureVideoProps = {
  src: string | null;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  width?: number;
  height?: number;
  captions?: { src: string; language: string; label: string };
};

export default function FeatureVideo({
  src, poster, posterWidth, posterHeight, width = 1080, height = 1920, captions,
}: FeatureVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionId = useId();
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playMessage, setPlayMessage] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const pause = () => video.pause();
    const onVisibilityChange = () => { if (document.hidden) pause(); };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      const fullscreen = document.fullscreenElement?.contains(video)
        || (video as HTMLVideoElement & { webkitDisplayingFullscreen?: boolean }).webkitDisplayingFullscreen;
      if (!entry.isIntersecting && !fullscreen && document.pictureInPictureElement !== video) pause();
    });
    observer?.observe(video);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", pause);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", pause);
      pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, failed]);

  async function play() {
    const video = videoRef.current;
    if (!video || !src) return;
    setPlayMessage("");
    setStarted(true);
    // Set these synchronously, while Safari still has the click's user activation.
    // No video URL is attached to the element before this direct interaction.
    video.src = src;
    video.controls = true;
    video.tabIndex = 0;
    video.focus({ preventScroll: true });
    try {
      await video.play();
    } catch (error) {
      if (videoRef.current !== video || (error instanceof DOMException && error.name === "AbortError")) return;
      setPlayMessage("Playback could not start. Try the video’s native Play control.");
    }
  }

  return (
    <figure className="feature-video" aria-label="Document scanning demonstration">
      <p className="feature-video-label"><Play size={13} aria-hidden="true" />See document scanning in action</p>
      <div className="feature-video-stage">
        <div className="feature-video-frame" style={{ aspectRatio: `${width} / ${height}` }}>
          {src && !failed ? (
            <>
              <video ref={videoRef} width={width} height={height} poster={poster} preload="none"
                playsInline controls={started} tabIndex={started ? 0 : -1}
                aria-label="Renewables document scanning demonstration" aria-describedby={captionId}
                onError={() => setFailed(true)}>
                {captions && <track kind="captions" src={captions.src} srcLang={captions.language} label={captions.label} default />}
                Your browser does not support this video. <a href={src}>Open the MP4 recording.</a>
              </video>
              {!started && <button type="button" className="feature-video-play" onClick={play}
                aria-label="Play the Renewables document scanning demonstration">
                <span className="feature-video-play-icon"><Play size={28} fill="currentColor" aria-hidden="true" /></span>
                <span>Play demo</span>
              </button>}
            </>
          ) : <img src={poster} width={posterWidth} height={posterHeight} loading="lazy" decoding="async"
            alt="Renewables scan review screen: check detected details against your document before applying them" />}
        </div>
      </div>
      <figcaption id={captionId}>
        Choose an image, crop it, then review detected details before applying them.<br />
        Silent demo using a specimen document. Reminder settings shown may depend on your plan.
      </figcaption>
      {(!src || failed) && <p className="feature-video-status" role="status">The video is currently unavailable. The scan review preview is shown instead.</p>}
      {playMessage && !failed && <p className="feature-video-status" role="status">{playMessage}</p>}
      {src && !failed && <noscript>
        <style>{".feature-video-play { display: none !important; }"}</style>
        <p className="feature-video-status"><a href={src}>Watch the document scanning recording (MP4).</a></p>
      </noscript>}
    </figure>
  );
}
