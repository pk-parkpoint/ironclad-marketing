export const CANONICAL_HOST = "ironcladtexas.com";
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}` as const;

export function stripTrailingSlashes(pathname: string): string {
  if (pathname === "/") {
    return "/";
  }
  return pathname.replace(/\/+$/, "");
}

