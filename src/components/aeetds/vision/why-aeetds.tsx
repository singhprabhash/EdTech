import { whyParagraphs } from "../../../content/aeetds-vision";
import { Eyebrow, Icon } from "../ui";

export default function WhyAeetdsSection() {
  return (
    <section
      className="vision-section vision-rationale bg-surface-container-low"
      aria-labelledby="why-aeetds-title"
    >
      <div className="aeetds-container grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
          <Eyebrow>FOUNDATIONAL RATIONALE</Eyebrow>
          <h2
            id="why-aeetds-title"
            className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg"
          >
            Why AEETDS
          </h2>
          <p className="vision-pull-line">
            AEETDS was set up to bring them together.
          </p>
          <div aria-hidden="true" className="vision-rationale-visual">
            <span className="vision-field-icon">
              <Icon name="agriculture" className="text-[56px]" />
            </span>
            <div className="vision-rationale-pillars">
              {[
                { icon: "science", label: "Science" },
                { icon: "storefront", label: "Enterprise" },
                { icon: "eco", label: "Environment" },
              ].map((item) => (
                <span key={item.label}>
                  <Icon name={item.icon} className="text-[26px]" />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="vision-why-copy min-w-0 rounded-xl bg-white text-body-md text-on-surface lg:col-span-7">
          {whyParagraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
