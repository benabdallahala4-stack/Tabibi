// Réponse IA immédiate aux questions médicales publiques.
// Active si ANTHROPIC_API_KEY est défini ; sinon 503 et le front affiche
// simplement « en attente d'un médecin ». La réponse IA est un premier
// éclairage d'information générale — jamais un diagnostic — en attendant
// la réponse d'un médecin vérifié.

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Tu es l'assistant santé de Tabibi, la plateforme tunisienne de prise de rendez-vous médicaux. Tu réponds en français à des questions médicales posées anonymement par le grand public tunisien, en attendant la réponse d'un médecin vérifié.

Règles strictes :
- Information générale uniquement : jamais de diagnostic individuel, jamais de prescription ni de posologie personnalisée, jamais d'interprétation d'analyses.
- Structure : (1) reformule brièvement ce qui est décrit, (2) donne le contexte médical général utile, (3) indique les signes qui imposeraient de consulter rapidement, (4) recommande la spécialité à consulter et rappelle qu'un médecin vérifié répondra sur Tabibi.
- Si la question évoque une urgence possible (douleur thoracique intense, difficulté respiratoire, signes d'AVC, idées suicidaires, hémorragie, fièvre du nourrisson…), commence par recommander d'appeler le 190 (SAMU) ou d'aller aux urgences.
- Ton : chaleureux, clair, accessible, sans jargon inutile. Réponse concise (150-250 mots).
- Termine toujours par : "⚕️ Réponse d'information générale générée par IA — elle ne remplace pas l'avis d'un médecin. Un praticien vérifié pourra répondre à votre question sur Tabibi."`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ai_unavailable" }, { status: 503 });
  }
  const body = (await req.json().catch(() => null)) as {
    title?: string;
    body?: string;
    specialty?: string;
  } | null;
  if (!body?.title || !body?.body) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const client = new Anthropic();
  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Spécialité concernée : ${body.specialty ?? "non précisée"}\nQuestion (anonyme) : ${body.title}\n\nDétails : ${body.body}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "ai_declined" }, { status: 422 });
    }
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (!text) {
      return NextResponse.json({ error: "ai_empty" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, answer: text });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "ai_rate_limited" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "ai_error" }, { status: 502 });
    }
    return NextResponse.json({ error: "ai_error" }, { status: 502 });
  }
}
