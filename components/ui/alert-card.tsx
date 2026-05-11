type AlertSeverity = "success" | "warning" | "danger" | "info";

const SEVERITY_STYLES: Record<AlertSeverity, { border: string; bg: string; icon: string }> = {
  success: { border: "border-l-green-500", bg: "bg-green-50", icon: "💰" },
  warning: { border: "border-l-orange-500", bg: "bg-orange-50", icon: "⚠️" },
  danger: { border: "border-l-red-500", bg: "bg-red-50", icon: "🚨" },
  info: { border: "border-l-blue-500", bg: "bg-blue-50", icon: "💡" },
};

interface AlertCardProps {
  severity: AlertSeverity;
  title: string;
  detail?: string;
}

export function AlertCard({ severity, title, detail }: AlertCardProps) {
  const s = SEVERITY_STYLES[severity];
  return (
    <div
      className={`border-l-4 rounded-r-xl p-3 ${s.border} ${s.bg}`}
      role={severity === "danger" ? "alert" : "status"}
    >
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0" aria-hidden="true">{s.icon}</span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {detail && <p className="mt-0.5 text-sm text-gray-700">{detail}</p>}
        </div>
      </div>
    </div>
  );
}
