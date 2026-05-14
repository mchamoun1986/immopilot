import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ImmoPilot — Guide achat immobilier primo-accédant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a1628 0%, #1a365d 50%, #2563eb 100%)",
          color: "white",
          fontFamily: "Inter, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#c1272d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            IP
          </div>
          <span style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            ImmoPilot
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Votre premier achat immobilier sans rien louper
        </div>
        <div
          style={{
            fontSize: "24px",
            opacity: 0.8,
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          10 étapes de A à Z — Simulateurs gratuits — PTZ 2026
        </div>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
            fontSize: "18px",
            opacity: 0.6,
          }}
        >
          <span>immopilot-rust.vercel.app</span>
          <span>100% gratuit</span>
          <span>Sans compte</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
