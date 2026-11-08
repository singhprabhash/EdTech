import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReadyDocument from "../../../components/ready-document";
import { catalogueQueryFromParams } from "../../../domain/catalogue";

export const metadata: Metadata = pageMetadata(
  "/subjects/[slug]",
  "Horticulture & Pomology | EdTech Publications",
  "Archived EdTech Publications design preview. Catalogue content is pending factual approval.",
);
export default async function Subject({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if ((await params).slug !== "horticulture-pomology") notFound();
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams))
    if (typeof value === "string") query.set(key, value);
  return (
    <ReadyDocument page="subject" query={catalogueQueryFromParams(query)} />
  );
}
