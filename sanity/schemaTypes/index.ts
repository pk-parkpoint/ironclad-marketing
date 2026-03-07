import { blogPost } from "./documents/blogPost";
import { companyInfo } from "./documents/companyInfo";
import { faq } from "./documents/faq";
import { location } from "./documents/location";
import { review } from "./documents/review";
import { service } from "./documents/service";
import { specialOffer } from "./documents/specialOffer";
import { teamMember } from "./documents/teamMember";
import { faqItem } from "./objects/faqItem";
import { processStep } from "./objects/processStep";
import { seo } from "./objects/seo";
import { trustPoint } from "./objects/trustPoint";

export const schemaTypes = [
  seo,
  processStep,
  faqItem,
  trustPoint,
  service,
  location,
  review,
  faq,
  blogPost,
  specialOffer,
  teamMember,
  companyInfo,
];
