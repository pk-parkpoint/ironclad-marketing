import Image from "next/image";

type OptimizedImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function OptimizedImage({ src, alt, priority = false, className }: OptimizedImageProps) {
  return (
    <Image
      alt={alt}
      className={className}
      height={720}
      placeholder="empty"
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      src={src}
      width={1200}
    />
  );
}
