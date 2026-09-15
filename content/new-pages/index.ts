import { PAID_LANDING_PAGE_DEFINITIONS } from "./paid-landing-pages";
import { SITE_PAGE_DEFINITIONS } from "./site-pages";

export { NEW_CUSTOMER_OFFER } from "./offer";
export type { NewPageDefinition } from "./types";

export const NEW_PAGE_DEFINITIONS = {
  ...PAID_LANDING_PAGE_DEFINITIONS,
  ...SITE_PAGE_DEFINITIONS,
};

export function getNewPageDefinition(path: string) {
  return NEW_PAGE_DEFINITIONS[path] ?? null;
}
