import { describe, expect, it } from "vitest";
import {
  catalogueQueryFromParams,
  queryCatalogue,
  type CatalogueRecord,
} from "../../src/domain/catalogue";

const records: readonly CatalogueRecord[] = [
  {
    id: "b",
    slug: "learning-together",
    title: "Learning Together",
    author: "Émile Roy",
    isbn: "978-1-234-56789-0",
    subject: "Education",
    year: "2023",
    language: "English",
    type: "Textbook",
    category: "Teaching",
    format: "Paperback",
    description: "A practical guide to classroom collaboration.",
  },
  {
    id: "c",
    slug: "cafe-learning",
    title: "Café Learning",
    author: "Ada Lewis",
    isbn: "9781234567883",
    subject: "Education",
    year: "2025",
    language: "French",
    type: "Research",
    category: "Teaching",
    format: "Hardback",
  },
  {
    id: "a",
    slug: "another-learning-together",
    title: "Learning Together",
    author: "Morgan Lee",
    isbn: "9781234567876",
    subject: "Science",
    year: "2023",
    language: "English",
    type: "Textbook",
  },
];

const ids = (result: CatalogueRecord[]) => result.map((record) => record.id);

describe("catalogue queries", () => {
  it.each([
    ["  LEARNING   TOGETHER ", ["b", "a"]],
    ["emile", ["b"]],
    ["cafe", ["c"]],
    ["SCIENCE", ["a"]],
    ["classroom collaboration", ["b"]],
    ["9781234567890", ["b"]],
    ["978-1-234-56788-3", ["c"]],
  ])(
    "searches normalized title, author, subject, description and ISBN: %s",
    (q, expected) => {
      expect(ids(queryCatalogue(records, { q }))).toEqual(expected);
    },
  );

  it.each([
    ["subject", "Science", ["a"]],
    ["year", "2025", ["c"]],
    ["language", "French", ["c"]],
    ["type", "Research", ["c"]],
    ["category", "Teaching", ["b", "c"]],
    ["format", "Paperback", ["b"]],
  ])("applies the %s facet independently", (key, value, expected) => {
    expect(ids(queryCatalogue(records, { [key]: value }))).toEqual(expected);
  });

  it("combines search and every selected facet with AND", () => {
    expect(
      ids(
        queryCatalogue(records, {
          q: "9781234567890",
          subject: " education ",
          year: "2023",
          language: "ENGLISH",
          type: "textbook",
          category: "teaching",
          format: "paperback",
        }),
      ),
    ).toEqual(["b"]);
    expect(
      queryCatalogue(records, { subject: "Science", language: "French" }),
    ).toEqual([]);
  });

  it("ignores empty/all facets and rejects unknown or partial facet values", () => {
    expect(
      ids(queryCatalogue(records, { q: "  ", subject: " ALL ", language: "" })),
    ).toEqual(["b", "c", "a"]);
    expect(queryCatalogue(records, { subject: "Educ" })).toEqual([]);
    expect(queryCatalogue(records, { format: "Digital" })).toEqual([]);
    expect(queryCatalogue([], { q: "learning" })).toEqual([]);
  });

  it("keeps input order for default and unknown sorts", () => {
    expect(ids(queryCatalogue(records, {}))).toEqual(["b", "c", "a"]);
    expect(ids(queryCatalogue(records, { sort: "unexpected" }))).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it.each([
    ["newest", ["c", "a", "b"]],
    ["year-asc", ["a", "b", "c"]],
    ["az", ["c", "a", "b"]],
  ])("sorts %s with deterministic title and id ties", (sort, expected) => {
    expect(ids(queryCatalogue(records, { sort }))).toEqual(expected);
  });

  it("breaks equal years by title before id and preserves complete ties", () => {
    const tied = records.map((record) => ({ ...record, year: "2023" }));
    expect(ids(queryCatalogue(tied, { sort: "newest" }))).toEqual([
      "c",
      "a",
      "b",
    ]);
    const duplicate = { ...records[0], slug: "second-copy" };
    expect(queryCatalogue([records[0], duplicate], { sort: "az" })).toEqual([
      records[0],
      duplicate,
    ]);
  });

  it("does not mutate a frozen input or its records", () => {
    const frozen = Object.freeze(
      records.map((record) => Object.freeze({ ...record })),
    );
    expect(ids(queryCatalogue(frozen, { sort: "newest" }))).toEqual([
      "c",
      "a",
      "b",
    ]);
    expect(ids([...frozen])).toEqual(["b", "c", "a"]);
  });
});

describe("catalogue URL parameters", () => {
  it("reads only the first supported parameters", () => {
    expect(
      catalogueQueryFromParams(
        new URLSearchParams(
          "q=first&q=second&subject=Science&subject=Education&year=2023&language=English&type=Textbook&category=Teaching&format=Paperback&sort=az&admin=true",
        ),
      ),
    ).toEqual({
      q: "first",
      subject: "Science",
      year: "2023",
      language: "English",
      type: "Textbook",
      category: "Teaching",
      format: "Paperback",
      sort: "az",
    });
  });

  it("bounds search length and keeps absent keys absent", () => {
    expect(catalogueQueryFromParams(new URLSearchParams())).toEqual({});
    expect(
      catalogueQueryFromParams(new URLSearchParams({ q: "a".repeat(201) })),
    ).toEqual({ q: "a".repeat(200) });
    expect(
      catalogueQueryFromParams(new URLSearchParams("q=&q=second")),
    ).toEqual({ q: "" });
  });
});
