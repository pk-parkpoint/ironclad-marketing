type SectionHeaderProps = {
  kicker: string;
  title: string;
  lead?: string;
  revealTitle?: boolean;
};

export function SectionHeader({ kicker, lead, revealTitle = false, title }: SectionHeaderProps) {
  return (
    <>
      <p className="local-section-kicker">{kicker}</p>
      <h2 className="local-section-title" data-reveal={revealTitle ? "" : undefined}>{title}</h2>
      {lead ? <p className="local-section-lead">{lead}</p> : null}
    </>
  );
}
