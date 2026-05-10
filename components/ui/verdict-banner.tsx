interface VerdictBannerProps {
  positive: boolean;
  label: string;
  detail?: string;
}

export function VerdictBanner({ positive, label, detail }: VerdictBannerProps) {
  return (
    <div
      className={`rounded-xl border p-3 text-sm font-semibold ${
        positive
          ? "border-green-300 bg-green-50 text-green-800"
          : "border-red-300 bg-red-50 text-red-800"
      }`}
    >
      {label}
      {detail && <span className="ml-1 font-normal">{detail}</span>}
    </div>
  );
}
