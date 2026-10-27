export interface CatalogueRecord {
  id: string;
  slug: string;
  title: string;
  author: string;
  isbn: string;
  subject: string;
  year: string;
  language: string;
  type: string;
  category?: string;
  format?: string;
  description?: string;
  cover?: string;
}

export interface CatalogueQuery {
  q?: string;
  subject?: string;
  year?: string;
  language?: string;
  type?: string;
  category?: string;
  format?: string;
  sort?: string;
}

const facetKeys = [
  "subject",
  "year",
  "language",
  "type",
  "category",
  "format",
] as const;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function queryCatalogue(
  records: readonly CatalogueRecord[],
  query: CatalogueQuery,
): CatalogueRecord[] {
  const search = normalize(query.q ?? "");
  const isbnSearch = search.replace(/[^0-9x]/g, "");
  const isIsbnSearch =
    /^[0-9x\s\p{P}]+$/u.test(search) && isbnSearch.length > 0;
  const result = records.filter((record) => {
    const matchesFacets = facetKeys.every((key) => {
      const value = (query[key] ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
      return (
        !value ||
        value === "all" ||
        (record[key] ?? "").trim().replace(/\s+/g, " ").toLowerCase() === value
      );
    });
    if (!matchesFacets) return false;
    if (!search) return true;
    return (
      [
        record.title,
        record.author,
        record.isbn,
        record.subject,
        record.description ?? "",
      ].some((value) => normalize(value).includes(search)) ||
      (isIsbnSearch &&
        normalize(record.isbn)
          .replace(/[^0-9x]/g, "")
          .includes(isbnSearch))
    );
  });

  if (!["newest", "year-asc", "az"].includes(query.sort ?? "")) return result;
  return result.sort((left, right) => {
    const byTitle = compareText(normalize(left.title), normalize(right.title));
    const ties = byTitle || compareText(left.id, right.id);
    if (query.sort === "az") return ties;
    const byYear = (Number(left.year) || 0) - (Number(right.year) || 0);
    return (query.sort === "newest" ? -byYear : byYear) || ties;
  });
}

export function catalogueQueryFromParams(
  params: URLSearchParams,
): CatalogueQuery {
  const query: CatalogueQuery = {};
  for (const key of ["q", ...facetKeys, "sort"] as const) {
    const value = params.get(key);
    if (value !== null) query[key] = key === "q" ? value.slice(0, 200) : value;
  }
  return query;
}
