/* ---------- Etkinlik türleri ---------- */
export type EventType = {
  key: string; label: string; role: string; namesLabel: string; motifDefault: string;
};
export const EVENTS: EventType[] = [
  { key: "dugun", label: "Düğün", role: "Evleniyoruz", namesLabel: "Gelin & Damat", motifDefault: "cift" },
  { key: "nisan", label: "Nişan", role: "Nişanlanıyoruz", namesLabel: "Çift", motifDefault: "yuzuk" },
  { key: "kina", label: "Kına Gecesi", role: "Kınamız var", namesLabel: "Gelin", motifDefault: "lale" },
  { key: "dogumgunu", label: "Doğum Günü", role: "Yaş günümü kutluyorum", namesLabel: "İsim", motifDefault: "pasta" },
  { key: "sunnet", label: "Sünnet", role: "Sünnet düğünümüz var", namesLabel: "Çocuk", motifDefault: "yildiz" },
  { key: "acilis", label: "Açılış", role: "Açılışa davetlisiniz", namesLabel: "İşletme", motifDefault: "kurdela" },
];

/* ---------- Motifler (dekoratif SVG inner-markup, accent renginde) ---------- */
export const MOTIFS: Record<string, string> = {
  cift: `<path d="M32 20c-4-6-14-4-14 4 0 6 8 11 14 16 6-5 14-10 14-16 0-8-10-10-14-4Z"/>`,
  yuzuk: `<circle cx="26" cy="34" r="10"/><circle cx="40" cy="34" r="10"/><path d="M33 20l3 5h-6l3-5Z"/>`,
  lale: `<path d="M32 14c3 6 9 8 9 14a9 9 0 0 1-18 0c0-6 6-8 9-14Z"/><path d="M32 40v10M27 46l5 2 5-2"/>`,
  pasta: `<path d="M18 34h28v14H18z"/><path d="M18 34c0-5 6-6 14-6s14 1 14 6M32 20v8M28 22l4-4 4 4"/>`,
  yildiz: `<path d="M32 16l4.5 11L48 28l-9 7 3 12-10-7-10 7 3-12-9-7 11.5-1L32 16Z"/>`,
  kurdela: `<path d="M20 24l12 10 12-10-4 12 4 12-12-10-12 10 4-12-4-12Z"/>`,
  yaprakli: `<path d="M32 12c8 8 8 20 0 34-8-14-8-26 0-34Z"/><path d="M22 26c6 2 8 8 10 14M42 26c-6 2-8 8-10 14"/>`,
};

/* ---------- Temalar ---------- */
export type Theme = {
  key: string; label: string; font: string; nameFont: string;
  bg: string; ink: string; sub: string; accent: string; card: string; motif: string;
};
export const THEMES: Theme[] = [
  { key: "zarafet", label: "Zarafet", font: "var(--t-playfair)", nameFont: "var(--t-playfair)",
    bg: "#fbf7f0", card: "#ffffff", ink: "#2c2a26", sub: "#8a8073", accent: "#b89152", motif: "yaprakli" },
  { key: "bahce", label: "Bahçe", font: "var(--t-cormorant)", nameFont: "var(--t-cormorant)",
    bg: "#f0f3ec", card: "#fbfcf8", ink: "#2b3327", sub: "#6f7a63", accent: "#5c7d54", motif: "lale" },
  { key: "elyazisi", label: "El Yazısı", font: "var(--t-cormorant)", nameFont: "var(--t-vibes)",
    bg: "#f9f0ef", card: "#fffafa", ink: "#43302f", sub: "#9a7b78", accent: "#bd6a68", motif: "cift" },
  { key: "zumrut", label: "Zümrüt", font: "var(--t-dmserif)", nameFont: "var(--t-dmserif)",
    bg: "#0f2a24", card: "#143630", ink: "#f2ede0", sub: "#a9c4b7", accent: "#cBA35a", motif: "yaprakli" },
  { key: "gece", label: "Gece", font: "var(--t-playfair)", nameFont: "var(--t-playfair)",
    bg: "#141a2e", card: "#1c2340", ink: "#f0eee6", sub: "#9aa2c0", accent: "#c8a24e", motif: "yildiz" },
  { key: "modern", label: "Modern", font: "var(--font-display)", nameFont: "var(--t-dmserif)",
    bg: "#f4f1ee", card: "#ffffff", ink: "#211f1d", sub: "#847d74", accent: "#c06a52", motif: "kurdela" },
];

/* ---------- Davetiye verisi ---------- */
export type Invite = {
  event: string; theme: string; motif: string;
  name1: string; name2: string; title: string; message: string;
  date: string; time: string; venue: string; address: string;
};
export const DEFAULT_INVITE: Invite = {
  event: "dugun", theme: "zarafet", motif: "yaprakli",
  name1: "Elif", name2: "Kaan", title: "", message: "Mutlu günümüzde bizi yalnız bırakmayın.",
  date: "2026-09-12", time: "18:00", venue: "Deniz Kır Bahçesi", address: "Sarıyer, İstanbul",
};

/* ---------- Yardımcılar ---------- */
const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export function formatDate(d: string): { day: string; full: string } {
  if (!d) return { day: "", full: "" };
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt.getTime())) return { day: "", full: d };
  return {
    day: GUNLER[dt.getDay()],
    full: `${dt.getDate()} ${AYLAR[dt.getMonth()]} ${dt.getFullYear()}`,
  };
}

export function countdown(date: string, time: string, nowMs: number): { d: number; h: number; m: number; past: boolean } {
  const t = new Date(`${date}T${time || "00:00"}:00`).getTime();
  const diff = t - nowMs;
  if (isNaN(t)) return { d: 0, h: 0, m: 0, past: false };
  if (diff <= 0) return { d: 0, h: 0, m: 0, past: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    past: false,
  };
}

export function waText(inv: Invite, url: string): string {
  const ev = EVENTS.find((e) => e.key === inv.event)?.label ?? "Etkinlik";
  const who = inv.name2 ? `${inv.name1} & ${inv.name2}` : inv.name1;
  const { full } = formatDate(inv.date);
  return `${who} ${ev} davetiyesi 💌\n${full}${inv.time ? " · " + inv.time : ""}\n${inv.venue}\n\nDavetiye ve LCV: ${url}`;
}

/* ---------- Paylaşım: davetiyeyi URL'e göm (UTF-8 güvenli base64) ---------- */
export function encodeInvite(inv: Invite): string {
  const json = JSON.stringify(inv);
  if (typeof window === "undefined") return "";
  return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
}
export function decodeInvite(param: string): Invite | null {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(param))));
    const o = JSON.parse(json);
    return { ...DEFAULT_INVITE, ...o };
  } catch { return null; }
}

/* ---------- Takvime ekle (Google Calendar linki) ---------- */
export function googleCalUrl(inv: Invite): string {
  const ev = EVENTS.find((e) => e.key === inv.event)?.label ?? "Etkinlik";
  const who = inv.name2 ? `${inv.name1} & ${inv.name2}` : inv.name1;
  const title = `${who} ${ev}`;
  const start = (inv.date || "").replace(/-/g, "");
  const [h, m] = (inv.time || "18:00").split(":");
  const s = `${start}T${(h || "18").padStart(2, "0")}${(m || "00").padStart(2, "0")}00`;
  // +4 saat bitiş
  const endH = String((Number(h || "18") + 4) % 24).padStart(2, "0");
  const e = `${start}T${endH}${(m || "00").padStart(2, "0")}00`;
  const loc = [inv.venue, inv.address].filter(Boolean).join(", ");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${s}/${e}&location=${encodeURIComponent(loc)}&details=${encodeURIComponent(inv.message || "")}`;
}

/* ---------- Harita linki ---------- */
export function mapUrl(inv: Invite): string {
  const q = [inv.venue, inv.address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/* ---------- Davetli / LCV veri tipi ---------- */
export type RsvpStatus = "geliyor" | "belki" | "gelmiyor";
export type Guest = { id: number; name: string; status: RsvpStatus; count: number; note?: string; at?: string };
