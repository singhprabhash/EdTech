import { officeRoles, committees } from "../../../content/aeetds-governance";
import { Eyebrow, Icon } from "../ui";

const roleFooters: Readonly<Record<string, string>> = {
  President: "Presiding and casting vote",
  "Vice-President": "Delegated responsibilities",
  Secretary: "Records and correspondence",
  Treasurer: "Accounts and Society funds",
  Editor: "Society publications",
};
const committeeIcons = [
  "event_note",
  "workspace_premium",
  "account_balance_wallet",
  "menu_book",
  "groups",
];

export function OfficeBearerRoles() {
  return (
    <section
      className="about-section-block bg-background"
      aria-labelledby="office-roles-title"
    >
      <div className="aeetds-container">
        <div className="mb-6">
          <Eyebrow>SECTION C • RESPONSIBILITIES</Eyebrow>
          <h2
            id="office-roles-title"
            className="font-headline-md text-headline-md text-primary"
          >
            Roles &amp; Constitutional Responsibilities
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {officeRoles.map((role) => (
            <article
              key={role.title}
              className={`governance-role-card ${role.title === "Editor" ? "md:col-span-2 lg:col-span-4" : ""}`}
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container text-secondary">
                  <Icon name={role.icon} />
                </div>
                <h3 className="mb-3 font-headline-sm text-[20px] font-semibold text-primary">
                  {role.title}
                </h3>
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  {role.text}
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 rounded bg-surface-container-low p-2 text-[11px] font-semibold text-primary">
                <Icon
                  name="check_circle"
                  className="shrink-0 text-[14px] text-secondary"
                />
                <span>{roleFooters[role.title]}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommitteesSection() {
  return (
    <section
      className="about-section-block governance-committees bg-surface-container-low/60"
      aria-labelledby="committees-title"
    >
      <div className="aeetds-container">
        <div className="mb-6">
          <Eyebrow>SECTION D • COMMITTEES</Eyebrow>
          <h2
            id="committees-title"
            className="font-headline-md text-headline-md text-primary"
          >
            Committees of the Society
          </h2>
        </div>
        <div className="governance-table-frame">
          <table
            className="committee-table governance-committee-table text-body-md"
            role="table"
            aria-label="Committees and responsibilities"
          >
            <thead>
              <tr>
                <th scope="col">Committee</th>
                <th scope="col">Function</th>
              </tr>
            </thead>
            <tbody>
              {committees.map((committee, index) => (
                <tr key={committee.name} role="row">
                  <th
                    scope="row"
                    role="rowheader"
                    className="font-semibold text-primary"
                  >
                    <span className="governance-committee-name">
                      <span className="governance-committee-icon">
                        <Icon
                          name={committeeIcons[index]}
                          className="text-[18px]"
                        />
                      </span>
                      <span>{committee.name}</span>
                    </span>
                  </th>
                  <td role="cell" className="text-on-surface-variant">
                    {committee.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
