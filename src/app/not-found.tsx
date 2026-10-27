import { ReadyLayout } from "../components/ready-document";
import Link from "next/link";

export default function NotFound() {
  return (
    <ReadyLayout>
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-6 text-4xl font-semibold text-primary">
          Page not found
        </h1>
        <p className="mb-6">The requested page is unavailable.</p>
        <Link
          className="font-semibold text-secondary underline underline-offset-4"
          href="/"
        >
          Return to home
        </Link>
      </main>
    </ReadyLayout>
  );
}
