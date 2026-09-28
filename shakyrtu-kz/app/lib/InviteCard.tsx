import React from "react";
import { EVENTS, MOTIFS, THEMES, formatDate, countdown, type Invite } from "./invite";

export function Motif({ name, color, size = 64 }: { name: string; color: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth={1.5}
         strokeLinecap="round" strokeLinejoin="round"
         dangerouslySetInnerHTML={{ __html: MOTIFS[name] ?? MOTIFS.yaprakli }} />
  );
}

/** Davetiye kartı (poster). now verilirse geri sayım gösterir. */
export function InviteCard({ inv, now, scale = 1 }: { inv: Invite; now?: number; scale?: number }) {
  const th = THEMES.find((t) => t.key === inv.theme) ?? THEMES[0];
  const ev = EVENTS.find((e) => e.key === inv.event) ?? EVENTS[0];
  const { day, full } = formatDate(inv.date);
  const cd = now ? countdown(inv.date, inv.time, now) : null;
  const twoNames = !!inv.name2.trim();
  const nameSize = (twoNames ? 40 : 46) * scale;
  const scriptBoost = th.nameFont.includes("vibes") ? 1.5 : 1;

  return (
    <div style={{
      background: th.bg, color: th.ink, borderRadius: 18, padding: `${44 * scale}px ${30 * scale}px`,
      textAlign: "center", fontFamily: th.font, position: "relative", overflow: "hidden",
      border: `1px solid ${th.accent}33`,
    }}>
      {/* köşe süsleri */}
      <div style={{ position: "absolute", top: 12 * scale, left: 12 * scale, opacity: .5 }}><CornerLine color={th.accent} s={scale} /></div>
      <div style={{ position: "absolute", top: 12 * scale, right: 12 * scale, opacity: .5, transform: "scaleX(-1)" }}><CornerLine color={th.accent} s={scale} /></div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 * scale }}>
        <Motif name={inv.motif || ev.motifDefault} color={th.accent} size={58 * scale} />
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: 11 * scale, letterSpacing: "0.26em", textTransform: "uppercase", color: th.accent, marginBottom: 14 * scale }}>
        {ev.role}
      </div>

      <div style={{ fontFamily: th.nameFont, fontSize: nameSize * scriptBoost, lineHeight: 1.05, fontWeight: 500 }}>
        {inv.name1 || "İsim"}
        {twoNames && (
          <>
            <div style={{ fontFamily: th.font, fontSize: nameSize * 0.5, color: th.accent, margin: `${2 * scale}px 0` }}>&amp;</div>
            {inv.name2}
          </>
        )}
      </div>

      <div style={{ width: 46 * scale, height: 1, background: th.accent, margin: `${20 * scale}px auto`, opacity: .6 }} />

      <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5 * scale, color: th.sub, letterSpacing: ".02em" }}>
        {day && <div style={{ textTransform: "uppercase", letterSpacing: ".18em", fontSize: 10.5 * scale, marginBottom: 4 * scale }}>{day}</div>}
        <div style={{ fontFamily: th.font, fontSize: 20 * scale, color: th.ink }}>{full || "Tarih"}</div>
        {inv.time && <div style={{ marginTop: 3 * scale }}>Saat {inv.time}</div>}
      </div>

      <div style={{ marginTop: 16 * scale, fontFamily: "var(--font-body)", fontSize: 13.5 * scale, color: th.ink }}>
        <div style={{ fontFamily: th.font, fontSize: 16 * scale }}>{inv.venue || "Mekân"}</div>
        {inv.address && <div style={{ color: th.sub, fontSize: 12.5 * scale, marginTop: 2 * scale }}>{inv.address}</div>}
      </div>

      {inv.message && (
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 13 * scale, color: th.sub, marginTop: 18 * scale, lineHeight: 1.5, maxWidth: 320 * scale, marginInline: "auto" }}>
          “{inv.message}”
        </p>
      )}

      {cd && !cd.past && (
        <div style={{ display: "flex", justifyContent: "center", gap: 14 * scale, marginTop: 22 * scale }}>
          {[["Gün", cd.d], ["Saat", cd.h], ["Dakika", cd.m]].map(([l, v]) => (
            <div key={l as string}>
              <div style={{ fontFamily: th.font, fontSize: 26 * scale, color: th.accent, lineHeight: 1 }}>{v as number}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9.5 * scale, letterSpacing: ".14em", textTransform: "uppercase", color: th.sub, marginTop: 3 * scale }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      {cd?.past && <div style={{ marginTop: 20 * scale, fontFamily: "var(--font-body)", fontSize: 12 * scale, color: th.accent, letterSpacing: ".1em" }}>Bu güzel günü birlikte yaşadık 💛</div>}
    </div>
  );
}

function CornerLine({ color, s }: { color: string; s: number }) {
  return (
    <svg width={40 * s} height={40 * s} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth={1}>
      <path d="M4 20 Q4 4 20 4" strokeLinecap="round" />
      <path d="M10 20 Q10 10 20 10" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}
