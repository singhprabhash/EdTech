import { society } from "../../../content/aeetds";
import { societyProfile } from "../../../content/aeetds-about";
import { Eyebrow, Icon } from "../ui";

export default function SocietyProfileSection() {
  return (
    <section className="about-section bg-white" aria-labelledby="profile-title">
      <div className="aeetds-container">
        <div className="mb-6 flex flex-col items-start gap-2">
          <Eyebrow>
            <span
              aria-hidden="true"
              className="inline-block h-0.5 w-6 bg-secondary"
            />
            Institutional Dossier
          </Eyebrow>
          <h2
            id="profile-title"
            className="font-headline-md text-headline-md font-semibold text-primary"
          >
            The Society in Brief
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Registration details, legal status and organisational profile
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside
            className="flex min-w-0 flex-col justify-between overflow-hidden rounded-xl bg-primary-dark p-6 text-white shadow-md lg:col-span-4"
            aria-labelledby="identity-title"
          >
            <div className="flex flex-col gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container shadow-inner">
                <Icon
                  name="shield"
                  className="text-[32px] text-tertiary-fixed-dim"
                />
              </div>
              <div>
                <p className="font-label-mono-isbn text-[11px] tracking-widest text-tertiary-fixed-dim uppercase">
                  Registered Society
                </p>
                <h3
                  id="identity-title"
                  className="mt-1 font-headline-sm text-headline-sm font-semibold"
                >
                  National Scientific Society
                </h3>
              </div>
              <p className="text-body-sm leading-relaxed text-surface-variant">
                National-level, non-profit scientific and educational society,
                founded in 2024 and based in Lucknow.
              </p>
            </div>
            <div className="-mx-6 -mb-6 mt-8 flex flex-col gap-2 bg-primary-container/60 p-6">
              <p className="flex flex-wrap items-center justify-between gap-2 font-label-mono-isbn text-[11px] text-primary-fixed-dim">
                <span>ESTABLISHED</span>
                <span className="font-bold text-white">2024</span>
              </p>
              <p className="flex flex-wrap items-center justify-between gap-2 font-label-mono-isbn text-[11px] text-primary-fixed-dim">
                <span>HEADQUARTERS</span>
                <span className="font-bold text-white">LUCKNOW, U.P.</span>
              </p>
            </div>
          </aside>
          <dl className="about-profile-rows flex min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-md lg:col-span-8">
            {societyProfile.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-2 p-4 transition-colors hover:bg-surface-container-low sm:flex-row sm:items-center sm:gap-4"
              >
                <dt className="flex items-center gap-2.5 text-[13px] font-medium text-on-surface-variant sm:w-1/3 sm:shrink-0">
                  <Icon
                    name={row.icon}
                    className="shrink-0 text-[18px] text-secondary"
                  />
                  {row.label}
                </dt>
                <dd className="min-w-0 text-[14px] leading-6 text-on-surface sm:flex-1">
                  {row.kind === "email" ? (
                    <a
                      href={`mailto:${society.email}`}
                      className="inline-flex min-h-11 max-w-full items-center gap-1 font-semibold text-secondary hover:underline"
                    >
                      <span className="break-all">{row.value}</span>
                      <Icon
                        name="open_in_new"
                        className="shrink-0 text-[16px]"
                      />
                    </a>
                  ) : row.kind === "registration" ? (
                    <span className="inline-block max-w-full rounded bg-surface-container px-2.5 py-1 font-label-mono-isbn text-[13px] font-bold tracking-wide text-primary">
                      {row.value}
                    </span>
                  ) : (
                    <span
                      className={
                        row.label === "Full Name"
                          ? "font-semibold text-primary"
                          : undefined
                      }
                    >
                      {row.value}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
