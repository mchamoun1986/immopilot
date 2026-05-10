import type { DpeClasse } from "@/lib/types";

const DPE_COLORS: Record<DpeClasse, string> = {
  A: "#009900", B: "#52a800", C: "#99cc00", D: "#ffcc00",
  E: "#ff9900", F: "#ff6600", G: "#cc0000",
};

interface DpeBadgeProps {
  classe: DpeClasse;
  size?: "sm" | "md";
}

export function DpeBadge({ classe, size = "sm" }: DpeBadgeProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-9 w-9 text-base";
  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded font-bold text-white ${sizeClasses}`}
      style={{ backgroundColor: DPE_COLORS[classe] }}
      title={`DPE ${classe}`}
    >
      {classe}
    </div>
  );
}
