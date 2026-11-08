import { coreValues, thrustAreas } from "../../../content/aeetds-vision";
import { Eyebrow, Icon } from "../ui";

export function ThrustAreasSection() {
  return (
    <section
      className="vision-section bg-surface-container-low"
      aria-labelledby="thrust-areas-title"
    >
      <div className="aeetds-container">
        <div className="mb-6 max-w-3xl">
          <Eyebrow>OPERATIONAL PILLARS</Eyebrow>
          <h2
            id="thrust-areas-title"
            className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg"
          >
            Thrust Areas
          </h2>
        </div>
        <ul
          aria-label="Thrust areas"
          className="vision-thrust-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {thrustAreas.map((area, index) => (
            <li
              key={area.title}
              className="vision-thrust-card min-w-0 rounded-xl bg-white p-5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-secondary">
                <Icon name={area.icon} />
              </div>
              <p className="font-label-mono-isbn text-[10px] text-on-surface-variant uppercase">
                Thrust Area {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 mb-2 font-headline-sm text-[18px] leading-6 font-semibold text-primary">
                {area.title}
              </h3>
              <p className="mb-1 text-[12px] font-semibold tracking-wider text-secondary uppercase">
                Focus
              </p>
              <p className="vision-focus-copy text-body-sm text-on-surface-variant">
                {area.focus}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CoreValuesSection() {
  return (
    <section
      className="vision-section bg-background"
      aria-labelledby="core-values-title"
    >
      <div className="aeetds-container">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>ETHICAL FOUNDATION</Eyebrow>
          </div>
          <h2
            id="core-values-title"
            className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg"
          >
            Core Values
          </h2>
        </div>
        <ul aria-label="Core values" className="vision-values-grid grid gap-4">
          {coreValues.map((value) => (
            <li
              key={value.name}
              className="vision-value-card flex min-w-0 flex-col items-center justify-center rounded-xl text-center"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-secondary shadow-sm">
                <Icon name={value.icon} />
              </div>
              <h3 className="text-title-sm text-primary">{value.name}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
