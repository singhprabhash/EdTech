import { pageMetadata } from "../../config/seo";
import type { Metadata } from "next";
import ReadyDocument from "../../components/ready-document";
import { catalogueQueryFromParams } from "../../domain/catalogue";

export const metadata: Metadata = pageMetadata(
  "/books",
  "Books Catalogue | EdTech Publications",
  "Archived EdTech Publications design preview. Catalogue content is pending factual approval.",
);
export default async function Books({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams))
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  return (
    <ReadyDocument page="catalogue" query={catalogueQueryFromParams(params)} />
  );
}
