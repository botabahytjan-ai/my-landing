import { NextResponse } from "next/server";

const DEMO: Record<string, string[]> = {
  dugun: [
    "Hayatımızın en güzel gününde, sevdiklerimizle bir arada olmak isteriz.",
    "İki ailenin bir olduğu bu mutlu günde aramızda görmekten mutluluk duyarız.",
  ],
  nisan: [
    "Birlikte atacağımız ilk adımda yanımızda olmanızı dileriz.",
    "Mutluluğumuzu sizinle paylaşmak, bu günü daha da anlamlı kılacak.",
  ],
  kina: [
    "Kınamızı yakarken, sevdiklerimizle eğlenmek isteriz.",
    "Bu geceyi hep birlikte, gönlümüzce kutlayalım.",
  ],
  dogumgunu: ["Yeni yaşımı sevdiklerimle kutlamak isterim, bekliyorum!"],
  sunnet: ["Oğlumuzun mutlu gününde bizi yalnız bırakmayın."],
  acilis: ["Yeni yerimizin açılışında sizi de aramızda görmek isteriz."],
};

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  const { event, name1, name2 } = await req.json().catch(() => ({ event: "dugun" }));
  const ev = (event as string) || "dugun";

  if (!key) {
    const list = DEMO[ev] || DEMO.dugun;
    return NextResponse.json({ demo: true, message: list[0] });
  }

  const who = name2 ? `${name1} ve ${name2}` : name1 || "ev sahibi";
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 160,
      messages: [{
        role: "user",
        content: `"${ev}" etkinliği için (${who}) sıcak, kısa ve zarif bir Türkçe davet mesajı yaz. Tek cümle veya iki kısa cümle, klişe olmayan, samimi. SADECE mesaj metnini döndür, tırnak veya açıklama ekleme.`,
      }],
    }),
  });
  if (!r.ok) return NextResponse.json({ demo: true, message: (DEMO[ev] || DEMO.dugun)[0] });
  const d = await r.json();
  const message = (d?.content?.[0]?.text ?? "").trim().replace(/^["“]|["”]$/g, "");
  return NextResponse.json({ demo: false, message: message || (DEMO[ev] || DEMO.dugun)[0] });
}
