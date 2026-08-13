type CriticalHeroPictureProps = {
  alt: string;
  avifSrcSet: string;
  className?: string;
  fallbackSrc: string;
  height: number;
  sizes?: string;
  width: number;
};

export function CriticalHeroPicture({
  alt,
  avifSrcSet,
  className,
  fallbackSrc,
  height,
  sizes = "100vw",
  width,
}: CriticalHeroPictureProps) {
  return (
    <>
      <link
        as="image"
        fetchPriority="high"
        href={fallbackSrc}
        imageSizes={sizes}
        imageSrcSet={avifSrcSet}
        rel="preload"
        type="image/avif"
      />
      <picture className="absolute inset-0 block h-full w-full">
        <source sizes={sizes} srcSet={avifSrcSet} type="image/avif" />
        <img
          alt={alt}
          className={className}
          decoding="async"
          fetchPriority="high"
          height={height}
          loading="eager"
          sizes={sizes}
          src={fallbackSrc}
          width={width}
        />
      </picture>
    </>
  );
}
