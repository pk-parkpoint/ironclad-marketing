type TrustCardProps = {
  title: string;
  description: string;
};

export function TrustCard({ title, description }: TrustCardProps) {
  return (
    <div className="card-shell p-6 md:p-7">
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm text-muted md:text-base">{description}</p>
    </div>
  );
}

