import Link from "next/link";

// Text identity while the approved circular seal remains unavailable.
export default function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      className={`brand${inverse ? " brand-inverse" : ""}`}
      href="/"
      aria-label="EdTech Publications home"
    >
      <span className="brand-name">EdTech</span>
      <span className="brand-descriptor">Publications</span>
    </Link>
  );
}
