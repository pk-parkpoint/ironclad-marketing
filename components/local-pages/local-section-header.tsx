type SectionHeaderProps = {
  kicker: string;
  title: string;
  lead?: string;
};

export function SectionHeader({ kicker, lead, title }: SectionHeaderProps) {
  return (
    <>
      <p className="local-section-kicker">{kicker}</p>
      <h2 className="local-section-title">{title}</h2>
      {lead ? <p className="local-section-lead">{lead}</p> : null}
    </>
  );
}
