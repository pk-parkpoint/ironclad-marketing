export function HomeHeroVideo() {
  return (
    <video
      aria-hidden="true"
      autoPlay
      className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      loop
      muted
      playsInline
      poster="/hero/ironclad-hero-poster.jpg"
      preload="auto"
    >
      <source
        media="(prefers-reduced-motion: no-preference)"
        src="/media/hero-video.mp4"
        type="video/mp4"
      />
      <source
        media="(prefers-reduced-motion: no-preference)"
        src="/hero/ironclad-hero-bg.webm"
        type="video/webm"
      />
    </video>
  );
}
