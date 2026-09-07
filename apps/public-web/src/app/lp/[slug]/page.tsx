import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/modules/content/api";
import { CmsBlockRenderer } from "@/modules/content/CmsBlockRenderer";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug).catch(() => null);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return buildMetadata({
    seo: page.seo,
    path: `/lp/${slug}`,
    fallbackTitle: page.title,
    fallbackDescription: `Explore ${page.title} by Truzon Homes.`,
  });
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug).catch(() => null);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <CmsBlockRenderer blocks={page.blocks || []} />
    </main>
  );
}
