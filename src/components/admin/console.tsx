"use client";
import { useEffect, useState, type FormEvent } from "react";
type Kind = "ticker" | "events" | "downloads" | "gallery" | "awardees";
type Item = Record<string, string | number>;
type Submission = {
  id: string;
  reference: string;
  type: string;
  created_at: string;
};
type Detail = Submission & {
  values: Record<string, unknown>;
  files: { id: string; kind: string; size: number }[];
  mail?: { kind: string; status: string; attempts: number }[];
};
const fields: Record<Kind, string[]> = {
  ticker: ["label", "text", "href"],
  events: [
    "slug",
    "shortName",
    "title",
    "subtitle",
    "category",
    "status",
    "dates",
    "startDate",
    "endDate",
    "venue",
    "shortVenue",
    "mode",
    "host",
    "organiser",
    "overview",
  ],
  downloads: ["title", "description", "href"],
  gallery: ["eventSlug", "src", "alt", "caption", "width", "height"],
  awardees: ["year", "groupId", "award", "name", "institution"],
};
const labels: Record<string, string> = {
  href: "Public link",
  src: "Image link",
  eventSlug: "Conference",
  shortName: "Short name",
  shortVenue: "Short venue",
  startDate: "Start date (YYYY-MM-DD)",
  endDate: "End date (YYYY-MM-DD)",
  groupId: "Award group ID",
  alt: "Image alternative text",
  width: "Image width (pixels)",
  height: "Image height (pixels)",
};
const slugs = ["crafns-2026", "ncfahs-2026", "fstat-2025", "iacrsaegns-2024"];
const awardGroups = [
  "lifetime",
  "research",
  "discipline",
  "extension",
  "young",
  "students",
  "women",
  "environment",
];
async function api(path: string, options?: RequestInit) {
  const response = await fetch(`/api/admin/${path}`, {
    ...options,
    cache: "no-store",
    credentials: "same-origin",
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "The request could not be completed.");
  return result;
}
export default function AdminConsole({
  signedIn,
  initialSubmission,
}: {
  signedIn: boolean;
  initialSubmission?: string;
}) {
  const [authenticated, setAuthenticated] = useState(signedIn);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<Kind | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [version, setVersion] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!authenticated || !initialSubmission) return;
    let active = true;
    api(`submissions/${initialSubmission}`)
      .then((result) => {
        if (active) setDetail(result);
      })
      .catch((error) => {
        if (active)
          setMessage(
            error instanceof Error ? error.message : "Submission unavailable.",
          );
      });
    return () => {
      active = false;
    };
  }, [authenticated, initialSubmission]);
  async function run(work: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await work();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    await run(async () => {
      await api("login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setAuthenticated(true);
    });
  }
  async function load(next: Kind) {
    await run(async () => {
      const result = await api(`content/${next}`);
      setKind(next);
      setItems(result.items);
      setVersion(result.version);
      setSubmissions(null);
      setDetail(null);
    });
  }
  async function list(nextOffset: number) {
    await run(async () => {
      const result = await api(`submissions?offset=${nextOffset}`);
      setSubmissions(result.items);
      setOffset(nextOffset);
      setKind(null);
      setDetail(null);
    });
  }
  function edit(index: number, field: string, value: string) {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: ["width", "height"].includes(field)
                ? Number(value)
                : value,
            }
          : item,
      ),
    );
  }
  return (
    <>
      <p>
        Publish only approved Society information. Private submissions and
        attachments remain restricted to this console.
      </p>
      <p role="status" aria-live="polite">
        {busy ? "Working…" : message}
      </p>
      {!authenticated ? (
        <form onSubmit={signIn}>
          <label>
            Administrator password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
            />
          </label>
          <button disabled={busy}>Sign in</button>
        </form>
      ) : (
        <>
          <nav aria-label="Administration">
            {(Object.keys(fields) as Kind[]).map((next) => (
              <button
                key={next}
                type="button"
                disabled={busy}
                aria-pressed={kind === next}
                onClick={() => load(next)}
              >
                {next[0].toUpperCase() + next.slice(1)}
              </button>
            ))}
            <button disabled={busy} onClick={() => list(0)}>
              Private submissions
            </button>
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api("logout", { method: "POST" });
                  setAuthenticated(false);
                  setItems([]);
                  setSubmissions(null);
                  setDetail(null);
                  setKind(null);
                })
              }
            >
              Sign out
            </button>
          </nav>
          <section aria-labelledby="upload-title">
            <h2 id="upload-title">Upload an approved public asset</h2>
            <p>
              Images, PDF and DOCX up to 10 MB require the configured safety
              scanner. Uploading alone does not publish a file. Copy the
              returned link into a collection and save to publish it.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                run(async () => {
                  const result = await api("assets", {
                    method: "POST",
                    body: form,
                  });
                  setMessage(`Uploaded. Public link: ${result.href}`);
                });
              }}
            >
              <label>
                Public asset
                <input
                  name="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.docx"
                  required
                />
              </label>
              <button disabled={busy}>Upload asset</button>
            </form>
          </section>
          {kind && (
            <section>
              <h2>{kind[0].toUpperCase() + kind.slice(1)}</h2>
              <p>
                Saving publishes this collection immediately. Reloading discards
                unsaved edits. A version conflict requires reloading and
                applying your changes again.
              </p>
              {items.map((item, index) => (
                <fieldset key={`${kind}-${index}`}>
                  <legend>Entry {index + 1}</legend>
                  {fields[kind].map((field) => {
                    const options = ["slug", "eventSlug"].includes(field)
                      ? slugs
                      : field === "category"
                        ? ["national", "international"]
                        : field === "status"
                          ? ["upcoming", "completed"]
                          : field === "groupId"
                            ? awardGroups
                            : null;
                    const label =
                      labels[field] || field[0].toUpperCase() + field.slice(1);
                    return (
                      <label key={field}>
                        {label}
                        {options ? (
                          <select
                            value={item[field] || ""}
                            onChange={(event) =>
                              edit(index, field, event.target.value)
                            }
                          >
                            {options.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        ) : [
                            "overview",
                            "description",
                            "caption",
                            "text",
                          ].includes(field) ? (
                          <textarea
                            maxLength={field === "overview" ? 6000 : 1500}
                            value={item[field] || ""}
                            onChange={(event) =>
                              edit(index, field, event.target.value)
                            }
                          />
                        ) : (
                          <input
                            type={
                              ["width", "height"].includes(field)
                                ? "number"
                                : "text"
                            }
                            min={1}
                            maxLength={1500}
                            value={item[field] || ""}
                            onChange={(event) =>
                              edit(index, field, event.target.value)
                            }
                          />
                        )}
                      </label>
                    );
                  })}
                  <button
                    type="button"
                    disabled={busy || kind === "events"}
                    onClick={() =>
                      setItems((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove entry {index + 1}
                  </button>
                </fieldset>
              ))}
              <button
                disabled={busy || kind === "events" || items.length >= 100}
                onClick={() =>
                  setItems((current) => [
                    ...current,
                    Object.fromEntries(
                      fields[kind].map((field) => [
                        field,
                        ["width", "height"].includes(field)
                          ? 1
                          : ["slug", "eventSlug"].includes(field)
                            ? slugs.find(
                                (slug) =>
                                  !current.some((item) => item.slug === slug),
                              ) || slugs[0]
                            : field === "category"
                              ? "national"
                              : field === "status"
                                ? "upcoming"
                                : field === "groupId"
                                  ? awardGroups[0]
                                  : "",
                      ]),
                    ),
                  ])
                }
              >
                Add entry
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    const result = await api(`content/${kind}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ items, version }),
                    });
                    setItems(result.items);
                    setVersion(result.version);
                    setMessage("Collection saved and published.");
                  })
                }
              >
                Save and publish
              </button>
              <button disabled={busy} onClick={() => load(kind)}>
                Reload collection
              </button>
            </section>
          )}
          {submissions && (
            <section>
              <h2>Private submissions</h2>
              {submissions.length === 0 && <p>No submissions on this page.</p>}
              <ul>
                {submissions.map((record) => (
                  <li key={record.id}>
                    <button
                      disabled={busy}
                      onClick={() =>
                        run(async () =>
                          setDetail(await api(`submissions/${record.id}`)),
                        )
                      }
                    >
                      {record.reference} · {record.created_at}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                disabled={busy || offset === 0}
                onClick={() => list(Math.max(0, offset - 50))}
              >
                Previous 50
              </button>
              <button
                disabled={busy || submissions.length < 50}
                onClick={() => list(offset + 50)}
              >
                Next 50
              </button>
            </section>
          )}
          {detail && (
            <section>
              <h2>{detail.reference}</h2>
              <h3>Email delivery</h3>
              <ul>
                {detail.mail?.map((item) => (
                  <li key={item.kind}>
                    {item.kind}: {item.status} · {item.attempts} attempts
                  </li>
                ))}
              </ul>
              {detail.mail?.some((item) => item.status === "failed") && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      const result = await api(
                        `submissions/${detail.id}/retry`,
                        { method: "POST" },
                      );
                      setDetail(await api(`submissions/${detail.id}`));
                      setMessage(
                        `${result.queued} failed email task(s) queued for retry. Delivery has not yet been confirmed.`,
                      );
                    })
                  }
                >
                  Retry failed email
                </button>
              )}
              <dl>
                {Object.entries(detail.values).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>
                      <pre>
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </pre>
                    </dd>
                  </div>
                ))}
              </dl>
              <h3>Private attachments</h3>
              <ul>
                {detail.files.map((file) => (
                  <li key={file.id}>
                    <a
                      className="admin-link"
                      href={`/api/admin/files/${file.id}`}
                    >
                      Download {file.kind} ({file.size} bytes)
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </>
  );
}
