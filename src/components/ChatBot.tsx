"use client";

// Assistant Tabibi — widget de chat flottant, FR/AR, à base de règles.

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { byId, findAnswer, STARTER_IDS, type QA } from "@/lib/chatbot";

interface Msg {
  from: "bot" | "user";
  text: string;
  suggestions?: string[]; // ids de QA
}

const UI = {
  fr: {
    title: "Assistant Tabibi",
    sub: "Réponses instantanées, 24h/24",
    placeholder: "Posez votre question…",
    send: "Envoyer",
    hello: "👋 Bonjour ! Je suis l'assistant Tabibi. Posez-moi une question ou choisissez un sujet :",
    fallback: "Je n'ai pas encore la réponse à cette question 🙏. Voici les sujets que je maîtrise — ou écrivez à support@tabibi.tn :",
    open: "Ouvrir l'assistant",
    close: "Fermer",
  },
  ar: {
    title: "مساعد طبيبي",
    sub: "إجابات فورية على مدار الساعة",
    placeholder: "اطرح سؤالك…",
    send: "إرسال",
    hello: "👋 مرحبًا! أنا مساعد طبيبي. اطرح سؤالك أو اختر موضوعًا:",
    fallback: "ليست لدي إجابة عن هذا السؤال بعد 🙏. هذه المواضيع التي أتقنها — أو راسل support@tabibi.tn:",
    open: "فتح المساعد",
    close: "إغلاق",
  },
};

export default function ChatBot() {
  const { locale } = useLocale();
  const t = UI[locale];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", text: t.hello, suggestions: STARTER_IDS }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function answerWith(qa: QA | null, userText: string) {
    const user: Msg = { from: "user", text: userText };
    const bot: Msg = qa
      ? { from: "bot", text: qa.a[locale], suggestions: qa.related }
      : { from: "bot", text: t.fallback, suggestions: STARTER_IDS };
    setMessages((m) => [...m, user, bot]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    answerWith(findAnswer(text), text);
  }

  function pick(id: string) {
    const qa = byId(id);
    if (qa) answerWith(qa, qa.q[locale]);
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.close : t.open}
        className="fixed bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-2xl text-white shadow-xl transition hover:bg-primary-700"
        style={{ insetInlineEnd: "1.25rem" }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Panneau */}
      {open && (
        <div
          className="fixed bottom-24 z-40 flex max-h-[70vh] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
          style={{ insetInlineEnd: "1.25rem" }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4 text-white">
            <p className="font-bold">🩺 {t.title}</p>
            <p className="text-xs text-primary-100">{t.sub}</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === "user"
                      ? "ms-auto bg-primary-600 text-white"
                      : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
                  }`}
                >
                  {m.text}
                </div>
                {m.from === "bot" && m.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.suggestions.map((id) => {
                      const qa = byId(id);
                      if (!qa) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => pick(id)}
                          className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-primary-100 transition hover:bg-primary-100"
                        >
                          {qa.q[locale]}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
            <button className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700">
              {t.send}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
