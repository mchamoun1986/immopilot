type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800",
  danger: "bg-red-100 text-red-800",
  warning: "bg-orange-100 text-orange-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-700",
};

interface BadgePillProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export function BadgePill({ variant, children }: BadgePillProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${VARIANT_CLASSES[variant]}`}>
      {children}
    </span>
  );
}
