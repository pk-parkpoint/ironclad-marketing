import Image from "next/image";

type SiteLogoTheme = "dark" | "light";

type SiteLogoProps = {
  theme?: SiteLogoTheme;
  className?: string;
  priority?: boolean;
};

const LOGO_SRC: Record<SiteLogoTheme, string> = {
  dark: "/media/logo/ironclad-logo-clear-dark.svg",
  light: "/media/logo/ironclad-logo-clear-light.svg",
};

export function SiteLogo({
  theme = "dark",
  className = "",
  priority = false,
}: SiteLogoProps) {
  return (
    <Image
      alt="Ironclad Plumbing"
      className={className}
      height={320}
      priority={priority}
      src={LOGO_SRC[theme]}
      unoptimized
      width={1100}
    />
  );
}
