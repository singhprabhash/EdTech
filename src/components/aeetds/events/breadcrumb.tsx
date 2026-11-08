import Link from "next/link";
import { Icon } from "../ui";
export default function EventBreadcrumb({ current }: { current?: string }) {
  return (
    <div className="bg-surface-container-low">
      <nav
        aria-label="Breadcrumb"
        className="aeetds-container py-3 text-body-sm text-on-surface-variant"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              prefetch={false}
              href="/"
              className="inline-flex min-h-11 items-center gap-1"
            >
              <Icon name="home" className="text-[16px]" />
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            {current ? (
              <Link
                prefetch={false}
                href="/events"
                className="inline-flex min-h-11 items-center"
              >
                Conferences &amp; Events
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-primary">
                Conferences &amp; Events
              </span>
            )}
          </li>
          {current && (
            <>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-primary">
                {current}
              </li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );
}
