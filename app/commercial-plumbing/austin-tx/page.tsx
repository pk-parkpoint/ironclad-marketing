import { permanentRedirect } from "next/navigation";
import { COMMERCIAL_PLUMBING_PATH } from "@/content/commercial-plumbing";

export default function CommercialPlumbingAustinRedirectPage() {
  permanentRedirect(COMMERCIAL_PLUMBING_PATH);
}
