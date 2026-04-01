type StatChipProps = {
  label: string;
  value: React.ReactNode;
};

export function StatChip({ label, value }: StatChipProps) {
  return (
    <div className="stat-chip">
      <span className="stat-chip__label">{label}</span>
      <span className="stat-chip__value">{value}</span>
    </div>
  );
}
