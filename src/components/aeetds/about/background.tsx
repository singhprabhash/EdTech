import { backgroundParagraphs } from "../../../content/aeetds-about";
import { Icon } from "../ui";

function BackgroundVisual() {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
      <figure className="overflow-hidden rounded-xl bg-white shadow-md">
        <div
          role="img"
          aria-label="Illustration representing agricultural research and learning"
          className="about-research-visual relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-container-high"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 480 360"
            className="absolute inset-0 h-full w-full text-secondary/10"
            preserveAspectRatio="xMidYMid slice"
          >
            <path fill="currentColor" d="M0 240Q240 80 480 240V360H0Z" />
            <g fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M240 190 20 360M240 190 110 360M240 190 200 360M240 190 290 360M240 190 380 360M240 190 470 360" />
              <path d="M0 280Q240 150 480 280M0 320Q240 200 480 320" />
            </g>
          </svg>
          <div className="relative flex flex-col items-center gap-4 text-center text-primary">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
              <Icon name="agriculture" className="text-[52px] text-secondary" />
            </span>
            <span className="font-headline-sm text-headline-sm">
              Agricultural Research
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-primary px-4 py-3 font-label-mono-isbn text-[10px] text-white">
            <span className="flex items-center gap-1.5">
              <Icon
                name="science"
                className="text-[14px] text-tertiary-fixed-dim"
              />
              RESEARCH &amp; LEARNING
            </span>
            <span>ILLUSTRATION</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-title-sm text-primary">
            <Icon name="handshake" className="text-[20px] text-secondary" />
            <span className="font-semibold">
              Agricultural Science &amp; Entrepreneurship
            </span>
          </div>
          <figcaption className="text-body-sm leading-relaxed text-on-surface-variant italic">
            Research, learning and entrepreneurship for farmers, students and
            rural youth.
          </figcaption>
          <div className="grid grid-cols-1 gap-2 pt-2 text-[12px] text-on-surface-variant sm:grid-cols-2">
            <span className="flex items-center gap-2 rounded bg-surface-container-low p-2">
              <Icon
                name="groups"
                className="shrink-0 text-[16px] text-secondary"
              />
              Rural Youth Mentorship
            </span>
            <span className="flex items-center gap-2 rounded bg-surface-container-low p-2">
              <Icon
                name="biotech"
                className="shrink-0 text-[16px] text-secondary"
              />
              Applied Crop Science
            </span>
          </div>
        </div>
      </figure>
      <div className="flex items-start gap-3 rounded-xl bg-surface-container-high/40 p-4 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
          <Icon name="account_balance" className="text-[20px]" />
        </span>
        <div>
          <p className="text-title-sm leading-tight text-primary">
            Societies Registration Act XXI of 1860
          </p>
          <p className="mt-1 text-[12px] text-on-surface-variant">
            Registered society • Lucknow, Uttar Pradesh
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BackgroundSection() {
  return (
    <section
      className="about-section bg-background"
      aria-labelledby="background-title"
    >
      <div className="aeetds-container grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-secondary-fixed/50 px-3 py-1 font-label-mono-isbn text-[11px] font-bold tracking-wider text-secondary uppercase">
              Institutional Background
            </span>
            <span className="font-label-mono-isbn text-[12px] text-on-surface-variant">
              FOUNDATION CHARTER
            </span>
          </div>
          <h2
            id="background-title"
            className="font-headline-md text-headline-md font-semibold tracking-tight text-primary"
          >
            Background &amp; Founding Mission
          </h2>
          <div className="about-background-copy space-y-5 text-body-md leading-relaxed text-on-surface">
            {backgroundParagraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
        <BackgroundVisual />
      </div>
    </section>
  );
}
