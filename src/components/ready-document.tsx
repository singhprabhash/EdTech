import { createElement, type CSSProperties, type ReactNode } from "react";
import data from "../content/ready-pages.json";
import catalogue from "../content/ready-catalogue.json";
import {
  queryCatalogue,
  type CatalogueQuery,
  type CatalogueRecord,
} from "../domain/catalogue";
import ReadyInteractions from "./ready-interactions";

export interface ReadyNode {
  tag: string;
  attrs: Record<string, string>;
  children: (ReadyNode | string)[];
}
type ReadyPageKey = "home" | "catalogue" | "subject" | "detail";
interface ReadyPages {
  header: ReadyNode;
  home: { main: ReadyNode; footer: ReadyNode; overlays?: ReadyNode[] };
  catalogue: { main: ReadyNode; footer: ReadyNode; overlays?: ReadyNode[] };
  subject: { main: ReadyNode; footer: ReadyNode; overlays?: ReadyNode[] };
  detail: { main: ReadyNode; footer: ReadyNode; overlays?: ReadyNode[] };
  detailSlug: string;
}
const pages = data as unknown as ReadyPages;
export const previewRecords = catalogue as (CatalogueRecord & {
  collection: string;
})[];
export const primaryDetailSlug = pages.detailSlug;

function inlineStyle(value: string): CSSProperties {
  return Object.fromEntries(
    value
      .split(";")
      .filter(Boolean)
      .map((entry) => {
        const colon = entry.indexOf(":");
        return [
          entry
            .slice(0, colon)
            .trim()
            .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
          entry.slice(colon + 1).trim(),
        ];
      }),
  );
}

// The compiler permits inert semantic tags only. Text is escaped by React; no raw
// HTML, scripts or source event-handler strings cross into the rendered document.
export function ReadyTree({
  node,
  visible,
  count,
  requestCopy = false,
}: {
  node: ReadyNode | string;
  visible?: Set<string>;
  count?: number;
  requestCopy?: boolean;
}): ReactNode {
  if (typeof node === "string")
    return requestCopy
      ? node
          .replace(/Download/g, "Request")
          .replace(/download/g, "request")
          .replace("Sample Chapter", "Request Sample")
      : node;
  const attrs: Record<string, unknown> = {};
  const names: Record<string, string> = {
    class: "className",
    tabindex: "tabIndex",
    for: "htmlFor",
    maxlength: "maxLength",
    viewbox: "viewBox",
    readonly: "readOnly",
    crossorigin: "crossOrigin",
    colspan: "colSpan",
    rowspan: "rowSpan",
  };
  for (const [key, value] of Object.entries(node.attrs)) {
    if (key.startsWith("on")) continue;
    if (key === "style") attrs.style = inlineStyle(value);
    else if (
      ["disabled", "hidden", "required", "multiple", "checked"].includes(key)
    )
      attrs[key] = true;
    else if (key === "value")
      attrs[node.tag === "option" ? "value" : "defaultValue"] = value;
    else attrs[names[key] ?? key] = value;
  }
  if (
    node.attrs["data-record-id"] &&
    visible &&
    !visible.has(node.attrs["data-record-id"])
  )
    attrs.hidden = true;
  if (node.tag === "input" && attrs.type === "search") attrs.maxLength = 200;
  let children: ReactNode = node.children.map((child, index) => (
    <ReadyTree
      key={index}
      node={child}
      visible={visible}
      count={count}
      requestCopy={requestCopy || Boolean(node.attrs["data-request-download"])}
    />
  ));
  if (
    count !== undefined &&
    ["visible-count", "pag-visible-count"].includes(node.attrs.id)
  )
    children = String(count);
  if (count !== undefined && node.attrs.id === "resultCounter")
    children = `${count} monographs`;
  if (
    node.tag === "input" ||
    node.tag === "img" ||
    node.tag === "br" ||
    node.tag === "hr"
  )
    return createElement(node.tag, attrs);
  return createElement(node.tag, attrs, children);
}

export function ReadyLayout({ children }: { children: ReactNode }) {
  return (
    <ReadyInteractions page="editorial" records={[]}>
      <ReadyTree node={pages.header} />
      {children}
      <ReadyTree node={pages.home.footer} />
    </ReadyInteractions>
  );
}

export default function ReadyDocument({
  page,
  query = {},
}: {
  page: ReadyPageKey;
  query?: CatalogueQuery;
}) {
  const records = previewRecords.filter((record) => record.collection === page);
  const visible = new Set(
    queryCatalogue(records, query).map((record) => record.id),
  );
  return (
    <ReadyInteractions page={page} records={records} initialQuery={query}>
      <ReadyTree node={pages.header} />
      <ReadyTree
        node={pages[page].main}
        visible={records.length ? visible : undefined}
        count={records.length ? visible.size : undefined}
      />
      {pages[page].overlays?.map((node, index) => (
        <ReadyTree key={index} node={node} />
      ))}
      <ReadyTree node={pages[page].footer} />
    </ReadyInteractions>
  );
}
