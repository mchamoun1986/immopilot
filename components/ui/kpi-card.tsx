import Link from "next/link";

interface KpiCardProps {
  label: string;
  value: string;
  color?: string;
  href?: string;
}

export function KpiCard({ label, value, color, href }: KpiCardProps) {
  const content = (
    <div className="card-elevated hover-lift cursor-pointer bg-white">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
