"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  EVENTS, THEMES, MOTIFS, DEFAULT_INVITE, waText, encodeInvite, type Invite,
} from "../lib/invite";
import { InviteCard, Motif } from "../lib/InviteCard";

type Guest = { id: number; name: string; status: "geliyor" | "belki" | "gelmiyor"; count: number };
const SEED: Guest[] = [
  { id: 1, name: "Ayşe Yılmaz", status: "geliyor", count: 2 },
  { id: 2, name: "Mehmet Demir", status: "geliyor", count: 4 },
  { id: 3, name: "Zeynep Kaya", status: "belki", count: 1 },
  { id: 4, name: "Ali Vural", status: "gelmiyor", count: 0 },
];

export default function Studio() {
  const [inv, setInv] = useState<Invite>(DEFAULT_INVITE);
  const [tab, setTab] = useState<"tasarla" | "lcv">("tasarla");
  const [now, setNow] = useState<number | undefined>(undefined);
  const [guests, setGuests] = useState<Guest[]>(SEED);
  const [gName, setGName] = useState("");
  const [gStatus, setGStatus] = useState<Guest["status"]>("geliyor");
  const [gCount, setGCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [ideaLoading, setIdeaLoading] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    try {
      const s = localStorage.getItem("davetiyem_guests");
      if (s) setGuests(JSON.parse(s));
    } catch {}
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("davetiyem_guests", JSON.stringify(guests)); } catch {}
  }, [guests]);

  const set = (k: keyof Invite, v: string) => setInv((p) => ({ ...p, [k]: v }));
  const ev = EVENTS.find((e) => e.key === inv.event) ?? EVENTS[0];

  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const shareUrl = origin ? `${origin}/davet?d=${encodeInvite(inv)}` : "";
  const wa = `https://wa.me/?text=${encodeURIComponent(waText(inv, shareUrl))}`;
  const copyLink = () => { if (!shareUrl) return; navigator.clipboard?.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1400); };

  const suggestMsg = async () => {
    setIdeaLoading(true);
    try {
      const r = await fetch("/api/metin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: inv.event, name1: inv.name1, name2: inv.name2 }),
      });
      const d = await r.json();
      if (d.message) set("message", d.message);
    } catch {}
    setIdeaLoading(false);
  };

  const stats = useMemo(() => {
    const geliyor = guests.filter((g) => g.status === "geliyor");
    const belki = guests.filter((g) => g.status === "belki");
    return {
      yanit: guests.length,
      geliyor: geliyor.length,
      belki: belki.length,
      gelmiyor: guests.filter((g) => g.status === "gelmiyor").length,
      kisi: geliyor.reduce((s, g) => s + g.count, 0),
    };
  }, [guests]);

  const addGuest = () => {
    if (!gName.trim()) return;
    setGuests((p) => [{ id: (p[0]?.id ?? 0) + 1 + Math.floor(now ?? 1), name: gName.trim(), status: gStatus, count: gStatus === "gelmiyor" ? 0 : gCount }, ...p]);
    setGName(""); setGCount(1); setGStatus("geliyor");
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" className="font-display" style={{ fontSize: 22 }}>Davetiyem</Link>
        <Link href="/" style={{ fontSize: 14, color: "var(--muted)" }}>← Ana sayfa</Link>
      </header>

      {/* Sekmeler */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "22px 22px 0" }}>
        <div className="tabline">
          {([["tasarla", "Davetiye Tasarla"], ["lcv", `Davetli Takibi · ${stats.kisi} kişi`]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={tab === k ? "on" : ""}>{l}</button>
          ))}
        </div>
      </div>

      {tab === "tasarla" ? (
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 22px 80px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 28 }} className="build-grid">
          {/* Form */}
          <div>
            <div className="card" style={{ padding: 22 }}>
              <div className="serif-eyebrow">Etkinlik</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 20px" }}>
                {EVENTS.map((e) => (
                  <button key={e.key} onClick={() => { set("event", e.key); set("motif", e.motifDefault); }} style={{
                    padding: "8px 14px", borderRadius: 999, fontSize: 13.5, cursor: "pointer",
                    border: inv.event === e.key ? "1.5px solid var(--accent)" : "1.5px solid var(--line)",
                    background: inv.event === e.key ? "var(--accent-soft)" : "var(--paper)", fontWeight: inv.event === e.key ? 600 : 400,
                  }}>{e.label}</button>
                ))}
              </div>

              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
                <label><span>{ev.namesLabel.split(" & ")[0] || "İsim"}</span><input className="field" style={{ marginTop: 5 }} value={inv.name1} onChange={(e) => set("name1", e.target.value)} /></label>
                <label><span>İkinci isim (opsiyonel)</span><input className="field" style={{ marginTop: 5 }} value={inv.name2} onChange={(e) => set("name2", e.target.value)} /></label>
                <label><span>Tarih</span><input type="date" className="field" style={{ marginTop: 5 }} value={inv.date} onChange={(e) => set("date", e.target.value)} /></label>
                <label><span>Saat</span><input type="time" className="field" style={{ marginTop: 5 }} value={inv.time} onChange={(e) => set("time", e.target.value)} /></label>
                <label><span>Mekân</span><input className="field" style={{ marginTop: 5 }} value={inv.venue} onChange={(e) => set("venue", e.target.value)} /></label>
                <label><span>Adres / ilçe, il</span><input className="field" style={{ marginTop: 5 }} value={inv.address} onChange={(e) => set("address", e.target.value)} /></label>
                <label style={{ gridColumn: "1 / -1" }}>
                  <span style={{ display: "flex", justifyContent: "space-between" }}>Davet mesajı <button onClick={suggestMsg} disabled={ideaLoading} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, cursor: "pointer", fontSize: 12.5 }}>{ideaLoading ? "..." : "Metin öner ✨"}</button></span>
                  <textarea className="field" rows={2} style={{ marginTop: 5, resize: "vertical" }} value={inv.message} onChange={(e) => set("message", e.target.value)} />
                </label>
              </div>
            </div>

            {/* Tema + motif */}
            <div className="card" style={{ padding: 22, marginTop: 18 }}>
              <div className="serif-eyebrow">Tema</div>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", marginTop: 12 }}>
                {THEMES.map((t) => (
                  <button key={t.key} onClick={() => set("theme", t.key)} style={{
                    padding: 0, borderRadius: 12, overflow: "hidden", cursor: "pointer",
                    border: inv.theme === t.key ? "2px solid var(--accent)" : "1px solid var(--line)",
                  }}>
                    <div style={{ background: t.bg, padding: "16px 8px", textAlign: "center" }}>
                      <div style={{ fontFamily: t.nameFont, color: t.ink, fontSize: 19 }}>{t.label}</div>
                      <div style={{ width: 24, height: 1, background: t.accent, margin: "6px auto 0" }} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="serif-eyebrow" style={{ marginTop: 20 }}>Motif</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {Object.keys(MOTIFS).map((m) => {
                  const th = THEMES.find((t) => t.key === inv.theme)!;
                  return (
                    <button key={m} onClick={() => set("motif", m)} style={{
                      width: 46, height: 46, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                      border: inv.motif === m ? "2px solid var(--accent)" : "1px solid var(--line)", background: "var(--paper)",
                    }}><Motif name={m} color={th.accent} size={26} /></button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Önizleme + paylaş */}
          <div style={{ position: "sticky", top: 16, alignSelf: "start" }}>
            <div className="serif-eyebrow" style={{ justifyContent: "center", marginBottom: 12 }}>Canlı önizleme</div>
            <div className="stage">
              <div className="stage-inv"><InviteCard inv={inv} now={now} /></div>
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
              <a href={wa} target="_blank" rel="noreferrer" className="btn btn-wa" style={{ width: "100%" }}>WhatsApp'tan gönder</a>
              <button className="btn btn-ghost" style={{ width: "100%" }} onClick={copyLink}>{copied ? "Bağlantı kopyalandı ✓" : "Bağlantıyı kopyala"}</button>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
              Davetlilerin bağlantıdan yanıt verir, gelenler "Davetli Takibi" sekmesine düşer.
            </p>
          </div>
        </div>
      ) : (
        /* LCV / Davetli takibi */
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 22px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="stat-grid">
            {[["Yanıt", stats.yanit, "var(--ink)"], ["Geliyor", stats.geliyor, "var(--accent)"], ["Belki", stats.belki, "var(--gold)"], ["Toplam kişi", stats.kisi, "var(--accent)"]].map(([l, v, c]) => (
              <div key={l as string} className="card" style={{ padding: 16, textAlign: "center" }}>
                <div className="font-display" style={{ fontSize: 30, color: c as string }}>{v as number}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{l as string}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20, marginTop: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Yanıt ekle (test)</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
              <label style={{ flex: "1 1 180px" }}><span>Ad soyad</span><input className="field" style={{ marginTop: 5 }} value={gName} placeholder="Davetli adı" onChange={(e) => setGName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addGuest()} /></label>
              <label><span>Durum</span><select className="field" style={{ marginTop: 5 }} value={gStatus} onChange={(e) => setGStatus(e.target.value as Guest["status"])}><option value="geliyor">Geliyor</option><option value="belki">Belki</option><option value="gelmiyor">Gelemiyor</option></select></label>
              <label style={{ width: 90 }}><span>Kişi</span><input type="number" min={0} className="field" style={{ marginTop: 5 }} value={gCount} onChange={(e) => setGCount(Math.max(0, +e.target.value))} /></label>
              <button className="btn" onClick={addGuest} style={{ padding: "12px 20px" }}>Ekle</button>
            </div>
          </div>

          <div className="card" style={{ padding: 8, marginTop: 18 }}>
            {guests.length === 0 && <p style={{ padding: 20, color: "var(--muted)", textAlign: "center" }}>Henüz yanıt yok.</p>}
            {guests.map((g) => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: g.status === "geliyor" ? "var(--accent)" : g.status === "belki" ? "var(--gold)" : "#c9c1b4" }} />
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{g.name}</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{g.status === "geliyor" ? "Geliyor" : g.status === "belki" ? "Belki" : "Gelemiyor"}{g.count > 0 ? ` · ${g.count} kişi` : ""}</span>
                </div>
                <button onClick={() => setGuests((p) => p.filter((x) => x.id !== g.id))} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>Gerçek kullanımda davetliler bağlantıdaki formdan yanıt verir; bu ekran otomatik dolar. (Demo: yanıtlar bu tarayıcıda saklanır.)</p>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .build-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  );
}
