type StatusPillProps = {
  status: string;
};

export function StatusPill({ status }: StatusPillProps) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const className =
    status === "approved"
      ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
      : status === "declined"
        ? "border-rose-300/20 bg-rose-400/10 text-rose-200"
        : "border-amber-300/20 bg-amber-400/10 text-amber-200";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}
