/**
 * France outline SVG — from geographic data (mapsicon/simple-world-map).
 * Public domain / open source paths.
 */
interface FranceMapProps {
  className?: string;
  variant?: "light" | "dark";
}

const MAINLAND = "M302.6,34.1l-32.6,8.0l-65.1,70.9l-19.6,1.3l-26.1,-18.4l-16.9,4.0l-13.0,40.7l-95.2,2.6l2.7,21.1l65.1,43.4l75.6,60.4l-1.3,72.2l-40.4,70.9l87.4,42.0l88.7,2.6l27.4,-31.5l56.0,1.3l15.6,14.5l56.0,-4.0l28.8,-36.9l-36.6,-43.3l-2.6,-27.6l7.8,-30.2l-18.3,-26.2l-31.3,9.1l-4.0,-23.6l69.1,-76.2v-46.0l-40.0,-13.1l-24.4,-16.8L302.6,34.1z";
const CORSICA = "M559.6,450.7l-28.8,28.9l-2.6,26.2l23.4,14.4l9.1,-1.3l5.2,-38.2L559.6,450.7z";

export function FranceMap({ className, variant = "light" }: FranceMapProps) {
  const isDark = variant === "dark";

  // Rouge francais for the stroke on dark backgrounds
  const strokeColor = isDark ? "#c1272d" : "currentColor";
  const fillColor = isDark ? "rgba(193,39,45,0.06)" : "rgba(26,54,93,0.04)";

  return (
    <svg
      viewBox="30 20 560 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mG" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={isDark ? "#c1272d" : "#1a365d"} stopOpacity={isDark ? "0.12" : "0.05"} />
          <stop offset="100%" stopColor={isDark ? "#c1272d" : "#1a365d"} stopOpacity="0.01" />
        </radialGradient>
      </defs>

      {/* Mainland France */}
      <path
        d={MAINLAND}
        fill="url(#mG)"
        stroke={strokeColor}
        strokeWidth={isDark ? "2.5" : "1.5"}
        strokeOpacity={isDark ? "0.5" : "0.18"}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Corsica */}
      <path
        d={CORSICA}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isDark ? "2" : "1"}
        strokeOpacity={isDark ? "0.4" : "0.15"}
        strokeLinejoin="round"
      />

      {/* Paris */}
      <circle cx="310" cy="135" r="14" fill={isDark ? "#c1272d" : "#c1272d"} opacity="0.08" />
      <circle cx="310" cy="135" r="6" fill={isDark ? "#c1272d" : "#c1272d"} opacity="0.2" />
      <circle cx="310" cy="135" r="3" fill={isDark ? "white" : "#c1272d"} opacity="0.8" />
      <text x="322" y="140" fontSize="13" fontWeight="700" fill={isDark ? "white" : "#1a365d"} opacity={isDark ? "0.5" : "0.25"} fontFamily="Inter,system-ui,sans-serif">Paris</text>

      {/* Lyon */}
      <circle cx="390" cy="300" r="3" fill={isDark ? "white" : "#2563eb"} opacity={isDark ? "0.5" : "0.35"} />
      <text x="400" y="305" fontSize="11" fontWeight="600" fill={isDark ? "white" : "#1a365d"} opacity={isDark ? "0.35" : "0.18"} fontFamily="Inter,system-ui,sans-serif">Lyon</text>

      {/* Marseille */}
      <circle cx="410" cy="395" r="3" fill={isDark ? "white" : "#2563eb"} opacity={isDark ? "0.5" : "0.35"} />
      <text x="422" y="400" fontSize="11" fontWeight="600" fill={isDark ? "white" : "#1a365d"} opacity={isDark ? "0.35" : "0.18"} fontFamily="Inter,system-ui,sans-serif">Marseille</text>

      {/* Bordeaux */}
      <circle cx="210" cy="335" r="2.5" fill={isDark ? "white" : "#2563eb"} opacity={isDark ? "0.4" : "0.3"} />
      <text x="220" y="340" fontSize="10" fontWeight="500" fill={isDark ? "white" : "#1a365d"} opacity={isDark ? "0.28" : "0.14"} fontFamily="Inter,system-ui,sans-serif">Bordeaux</text>

      {/* Nantes */}
      <circle cx="155" cy="230" r="2" fill={isDark ? "white" : "#2563eb"} opacity={isDark ? "0.35" : "0.25"} />
      <text x="163" y="234" fontSize="9" fontWeight="500" fill={isDark ? "white" : "#1a365d"} opacity={isDark ? "0.22" : "0.12"} fontFamily="Inter,system-ui,sans-serif">Nantes</text>

      {/* Strasbourg */}
      <circle cx="465" cy="135" r="2" fill={isDark ? "white" : "#2563eb"} opacity={isDark ? "0.35" : "0.25"} />

      {/* Toulouse */}
      <circle cx="270" cy="395" r="2" fill={isDark ? "white" : "#2563eb"} opacity={isDark ? "0.35" : "0.25"} />
      <text x="278" y="399" fontSize="9" fontWeight="500" fill={isDark ? "white" : "#1a365d"} opacity={isDark ? "0.22" : "0.12"} fontFamily="Inter,system-ui,sans-serif">Toulouse</text>

      {/* Lille */}
      <circle cx="305" cy="55" r="2" fill={isDark ? "white" : "#2563eb"} opacity={isDark ? "0.35" : "0.25"} />
      <text x="313" y="59" fontSize="9" fontWeight="500" fill={isDark ? "white" : "#1a365d"} opacity={isDark ? "0.22" : "0.12"} fontFamily="Inter,system-ui,sans-serif">Lille</text>
    </svg>
  );
}
