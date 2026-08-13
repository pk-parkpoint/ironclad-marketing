import { ArrowRight, ShieldCheck } from "lucide-react";
import type { CompanyPageConfig } from "./company-page-types";
import styles from "./company-page.module.css";

function NumberLabel({ index }: { index: number }) {
  return <span className={styles.numberLabel}>{String(index + 1).padStart(2, "0")}</span>;
}

export function CompanyRows({ config }: { config: CompanyPageConfig }) {
  return (
    <section className={styles.rowsSection} data-company-section="rows">
      <div className={styles.rowsInner}>
        <h2>{config.rowsHeading}</h2>
        <p className={styles.sectionLead}>{config.rowsLead}</p>
        <div className={styles.rowsList}>
          {config.rows.map((row, index) => (
            <article className={styles.numberedRow} key={row.title}>
              <NumberLabel index={index} />
              <div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.callout}>
          <div className={styles.calloutCopy}>
            <span className={styles.calloutIcon}><ShieldCheck aria-hidden="true" size={23} /></span>
            <div>
              <h3>{config.callout.title}</h3>
              <p>{config.callout.body}</p>
            </div>
          </div>
          <a href={config.callout.href}>{config.callout.label}</a>
        </aside>
      </div>
    </section>
  );
}

export function CompanyCredo({ config }: { config: CompanyPageConfig }) {
  if (!config.credo) return null;

  return (
    <section className={styles.credoSection} data-company-section="credo">
      <div className={styles.credoInner}>
        <p className={styles.eyebrowLine}>{config.credo.label}</p>
        <blockquote>{config.credo.quote}</blockquote>
        <p className={styles.credoBody}>{config.credo.body}</p>
      </div>
    </section>
  );
}

export function CompanyRoles({ config }: { config: CompanyPageConfig }) {
  if (!config.roles) return null;

  return (
    <section className={styles.rolesSection} data-company-section="roles" id="roles">
      <div className={styles.rolesInner}>
        <h2>{config.roles.heading}</h2>
        <p className={styles.sectionLead}>{config.roles.intro}</p>
        <div className={styles.rolesGrid}>
          {config.roles.items.map((role, index) => (
            <a className={styles.roleCard} href={role.href} key={role.title}>
              <span>Role {String(index + 1).padStart(2, "0")}</span>
              <h3>{role.title}</h3>
              <p>{role.body}</p>
              <strong>{role.cta}<ArrowRight aria-hidden="true" size={16} /></strong>
            </a>
          ))}
        </div>
        <a className={styles.resumeButton} href={config.roles.action.href}>
          {config.roles.action.label}<ArrowRight aria-hidden="true" size={17} />
        </a>
      </div>
    </section>
  );
}
