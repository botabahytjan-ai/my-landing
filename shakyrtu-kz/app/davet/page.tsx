"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  EVENTS, DEFAULT_INVITE, decodeInvite, formatDate, countdown, googleCalUrl, mapUrl,
  type Invite, type Guest, type RsvpStatus,
} from "../lib/invite";
import { InviteCard } from "../lib/InviteCard";

export default function Davet() {
  const [inv, setInv] = useState<Invite | null>(null);
  const [now, setNow] = useState<number | undefined>(undefined);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RsvpStatus>("geliyor");
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    const p = new URLSearchParams(window.location.search).get("d");
    setInv(p ? decodeInvite(p) ?? DEFAULT_INVITE : DEFAULT_INVITE);
    return () => clearInterval(t);
  }, []);

  if (!inv) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>Davetiye yükleniyor…</main>;

  const ev = EVENTS.find((e) => e.key === inv.event) ?? EVENTS[0];
  const who = inv.name2 ? `${inv.name1} & ${inv.name2}` : inv.name1;
  const { full, day } = formatDate(inv.date);
  const cd = countdown(inv.date, inv.time, now ?? Date.now());

  const submit = () => {
    if (!name.trim()) return;
    const g: Guest = {
      id: Date.now(), name: name.trim(), status,
      count: status === "gelmiyor" ? 0 : count, note: note.trim() || undefined,
      at: new Date().toISOString().slice(0, 10),
    };
    try {
      const s = localStorage.getItem("davetiyem_guests");
      const list: Guest[] = s ? JSON.parse(s) : [];
      localStorage.setItem("davetiyem_guests", JSON.stringify([g, ...list]));
    } catch {}
    setSent(true);
  };

  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 0", textAlign: "center" }}>
        <div className="serif-eyebrow" style={{ justifyContent: "center" }}>{ev.label} · Davetlisiniz</div>

        {/* Davetiye kartı */}
        <div className="stage" style={{ marginTop: 18 }}>
          <div className="stage-inv"><InviteCard inv={inv} now={now} /></div>
        </div>

        {/* Geri sayım */}
        {!cd.past && (inv.date) && (
          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 22 }} aria-label={`${cd.d} gün ${cd.h} saat kaldı`}>
            {[[cd.d, "gün"], [cd.h, "saat"], [cd.m, "dakika"]].map(([v, l]) => (
              <div key={l as string}>
                <div className="font-display" style={{ fontSize: 30, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{v as number}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>{l as string}</div>
              </div>
            ))}
          </div>
        )}

        {/* Etkinlik detayları */}
        <div className="card" style={{ padding: 20, marginTop: 22, textAlign: "left" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <Detail label="Tarih" value={`${full}${day ? " · " + day : ""}`} />
            {inv.time && <Detail label="Saat" value={inv.time} />}
            {inv.venue && <Detail label="Mekân" value={inv.venue} />}
            {inv.address && <Detail label="Adres" value={inv.address} />}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <a href={mapUrl(inv)} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ flex: "1 1 140px", justifyContent: "center" }}>Haritada aç</a>
            <a href={googleCalUrl(inv)} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ flex: "1 1 140px", justifyContent: "center" }}>Takvime ekle</a>
          </div>
        </div>

        {/* RSVP / LCV formu */}
        {!sent ? (
          <div className="card" style={{ padding: 22, marginTop: 18, textAlign: "left" }}>
            <div className="serif-eyebrow">Yanıtınız</div>
            <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "6px 0 16px" }}>Katılımınızı bildirin, {who} sizi beklesin.</p>
            <label><span>Ad soyad</span><input className="field" style={{ marginTop: 5 }} value={name} placeholder="Adınız ve soyadınız…" autoComplete="name" onChange={(e) => setName(e.target.value)} /></label>
            <div style={{ display: "flex", gap: 8, margin: "14px 0" }}>
              {([["geliyor", "Geliyorum"], ["belki", "Belki"], ["gelmiyor", "Gelemiyorum"]] as const).map(([k, l]) => (
                <button key={k} type="button" aria-pressed={status === k} onClick={() => setStatus(k)} style={{
                  flex: 1, padding: "11px 6px", borderRadius: 10, cursor: "pointer", fontSize: 13.5, fontWeight: status === k ? 700 : 400,
                  border: status === k ? "2px solid var(--accent)" : "1.5px solid var(--line)",
                  background: status === k ? "var(--accent-soft)" : "var(--paper)", color: "var(--ink)",
                }}>{l}</button>
              ))}
            </div>
            {status !== "gelmiyor" && (
              <label style={{ display: "block", marginBottom: 14 }}><span>Kaç kişi geliyorsunuz?</span>
                <input type="number" min={1} className="field" style={{ marginTop: 5 }} value={count} inputMode="numeric" onChange={(e) => setCount(Math.max(1, +e.target.value))} /></label>
            )}
            <label><span>Not (opsiyonel)</span><textarea className="field" rows={2} style={{ marginTop: 5, resize: "vertical" }} value={note} placeholder="İyi dileklerinizi yazın…" onChange={(e) => setNote(e.target.value)} /></label>
            <button className="btn" style={{ width: "100%", marginTop: 16 }} onClick={submit} disabled={!name.trim()}>Yanıtı gönder</button>
          </div>
        ) : (
          <div className="card" style={{ padding: 28, marginTop: 18, textAlign: "center" }}>
            <div style={{ fontSize: 40 }} aria-hidden="true">{status === "gelmiyor" ? "💌" : "🎉"}</div>
            <h2 className="font-display" style={{ fontSize: 24, marginTop: 8 }}>{status === "gelmiyor" ? "Teşekkürler, haber verdiniz" : "Harika, sizi bekliyoruz!"}</h2>
            <p style={{ color: "var(--muted)", marginTop: 6 }}>Yanıtınız {who} ile paylaşıldı{status !== "gelmiyor" ? `, ${count} kişi olarak kaydedildiniz` : ""}.</p>
            <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setSent(false); setName(""); setNote(""); }}>Başka yanıt ekle</button>
          </div>
        )}

        <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 22, lineHeight: 1.6 }}>
          Bu davetiye <Link href="/" style={{ color: "var(--accent)" }}>Davetiyem</Link> ile hazırlandı. Kendi davetiyeni dakikada oluştur.
        </p>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
      <span style={{ fontSize: 12.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
      <span style={{ fontSize: 14.5, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}
