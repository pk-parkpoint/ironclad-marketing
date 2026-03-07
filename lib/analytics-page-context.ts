export type PageContext = {
  pageTemplate: string;
  pageFamily: string;
  service: string;
  city: string;
};

function toTitleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function derivePageContext(pathname: string): PageContext {
  if (pathname === "/") {
    return { pageTemplate: "home", pageFamily: "core", service: "", city: "" };
  }

  if (pathname.startsWith("/plumbing/") && pathname !== "/plumbing") {
    const slug = pathname.replace("/plumbing/", "");
    return {
      pageTemplate: "service_detail",
      pageFamily: "service",
      service: toTitleCase(slug),
      city: "Austin",
    };
  }

  if (pathname.startsWith("/service-area/") && pathname !== "/service-area") {
    const slug = pathname.replace("/service-area/", "");
    return {
      pageTemplate: "city_detail",
      pageFamily: "service_area",
      service: "",
      city: toTitleCase(slug.replace("-tx", "")),
    };
  }

  if (pathname.startsWith("/blog/")) {
    return { pageTemplate: "article_detail", pageFamily: "article", service: "", city: "" };
  }

  if (pathname.startsWith("/commercial-plumbing/")) {
    return { pageTemplate: "commercial", pageFamily: "commercial", service: "Commercial Plumbing", city: "Austin" };
  }

  if (pathname === "/plumbing") {
    return { pageTemplate: "service_hub", pageFamily: "service", service: "", city: "Austin" };
  }

  if (pathname === "/service-area") {
    return { pageTemplate: "service_area_hub", pageFamily: "service_area", service: "", city: "" };
  }

  if (pathname.startsWith("/faq")) {
    return { pageTemplate: "faq", pageFamily: "education", service: "", city: "" };
  }

  if (pathname.startsWith("/book")) {
    return { pageTemplate: "booking", pageFamily: "conversion", service: "", city: "" };
  }

  if (pathname.startsWith("/contact")) {
    return { pageTemplate: "contact", pageFamily: "conversion", service: "", city: "" };
  }

  return { pageTemplate: "core", pageFamily: "core", service: "", city: "" };
}

export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  if (width < 768) {
    return "mobile";
  }
  if (width < 1024) {
    return "tablet";
  }
  return "desktop";
}
