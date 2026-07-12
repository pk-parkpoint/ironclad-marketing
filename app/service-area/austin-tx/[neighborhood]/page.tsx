import { notFound } from "next/navigation";
import { LocalNeighborhoodPage } from "@/components/local-pages/local-neighborhood-page";
import {
  buildLocalPageTitle,
  getLocalNeighborhoodPage,
  getLocalNeighborhoodStaticParams,
} from "@/content/local-pages";
import { buildPageMetadata } from "@/lib/seo";

type RouteParams = {
  neighborhood: string;
};

type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return getLocalNeighborhoodStaticParams();
}

export async function generateMetadata({ params }: RouteProps) {
  const { neighborhood } = await params;
  const page = getLocalNeighborhoodPage(neighborhood);

  if (!page) {
    return {};
  }

  return buildPageMetadata({
    description: page.intro,
    ogTemplate: "location",
    path: page.path,
    title: buildLocalPageTitle(page),
  });
}

export default async function NeighborhoodPage({ params }: RouteProps) {
  const { neighborhood } = await params;
  const page = getLocalNeighborhoodPage(neighborhood);

  if (!page) {
    notFound();
  }

  return <LocalNeighborhoodPage page={page} />;
}
