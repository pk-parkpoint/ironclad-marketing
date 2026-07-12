import { notFound } from "next/navigation";
import { LegacyLocationPage } from "@/components/local-pages/legacy-location-page";
import { LocalCityPage } from "@/components/local-pages/local-city-page";
import { getLocalCityPage, buildLocalPageTitle } from "@/content/local-pages";
import { LOCATIONS } from "@/content/locations";
import { buildPageMetadata } from "@/lib/seo";

type RouteParams = {
  slug: string;
};

type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return LOCATIONS.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: RouteProps) {
  const { slug } = await params;
  const localPage = getLocalCityPage(slug);

  if (localPage) {
    return buildPageMetadata({
      description: localPage.intro,
      ogTemplate: "location",
      path: localPage.path,
      title: buildLocalPageTitle(localPage),
    });
  }

  const location = LOCATIONS.find((entry) => entry.slug === slug);
  if (!location) {
    return {};
  }

  return buildPageMetadata({
    description: location.metaDescription,
    path: `/service-area/${location.slug}`,
    title: location.titleTag,
  });
}

export default async function LocationDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const localPage = getLocalCityPage(slug);

  if (localPage) {
    return <LocalCityPage page={localPage} />;
  }

  if (!LOCATIONS.some((entry) => entry.slug === slug)) {
    notFound();
  }

  return <LegacyLocationPage slug={slug} />;
}
