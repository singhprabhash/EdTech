import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReadyDocument, {
  ReadyLayout,
  previewRecords,
  primaryDetailSlug,
} from "../../../components/ready-document";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = previewRecords.find((r) => r.slug === slug);
  return {
    title: record ? `${record.title} | EdTech Publications` : "Book not found",
  };
}
export default async function BookDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = previewRecords.find((r) => r.slug === slug);
  if (!record) notFound();
  if (slug === primaryDetailSlug) return <ReadyDocument page="detail" />;
  return (
    <ReadyLayout>
      <main
        id="main"
        tabIndex={-1}
        className="editorial-page mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-12 pb-20"
      >
        <nav
          aria-label="Breadcrumbs"
          className="py-8 text-body-sm text-on-surface-variant"
        >
          <Link href="/">Home</Link> / <Link href="/books">Catalogue</Link> /{" "}
          {record.subject}
        </nav>
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4 bg-surface-container p-8 rounded-xl">
            {record.cover && (
              /* Exact supplied artwork, dimensions reserve layout space. */ <picture>
                <img
                  src={record.cover}
                  width={600}
                  height={850}
                  alt={record.title}
                  className="w-full h-auto shadow-xl"
                />
              </picture>
            )}
          </div>
          <div className="lg:col-span-8 flex flex-col gap-5">
            <p className="text-secondary text-label-md uppercase">
              {record.subject} · {record.year}
            </p>
            <h1 className="font-headline-lg text-headline-lg text-primary">
              {record.title}
            </h1>
            <p className="font-body-lg text-body-lg">{record.author}</p>
            <dl className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl">
              <dt>ISBN</dt>
              <dd>{record.isbn}</dd>
              <dt>Language</dt>
              <dd>{record.language}</dd>
              <dt>Publication year</dt>
              <dd>{record.year}</dd>
              <dt>Type</dt>
              <dd>{record.type}</dd>
            </dl>
            <a
              className="bg-primary text-white rounded-lg px-6 py-4 w-fit"
              href={`mailto:edtechpublications@gmail.com?subject=${encodeURIComponent(`Book enquiry: ${record.title}`)}`}
            >
              Enquire about this book →
            </a>
          </div>
        </div>
      </main>
    </ReadyLayout>
  );
}
