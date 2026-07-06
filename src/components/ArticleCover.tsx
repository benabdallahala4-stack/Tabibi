// Couverture éditoriale des articles du Magazine Santé : dégradé + motifs
// vectoriels sobres, sans emoji. Pour passer à de vraies photos plus tard :
// ajoutez `coverImage` (chemin /public) au modèle Article et remplacez le
// fond par <Image fill …> — le reste de la carte ne change pas.

import type { Article } from "@/lib/articles";
import { Icon, SPECIALTY_ICON } from "@/components/Icons";

export default function ArticleCover({
  article,
  className = "h-40",
  compact = false,
}: {
  article: Article;
  className?: string;
  compact?: boolean;
}) {
  const iconName = SPECIALTY_ICON[article.specialtyId] ?? "stethoscope";
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(120deg, ${article.gradient[0]}, ${article.gradient[1]})` }}
    >
      {/* Motif : arcs concentriques + trame de points, très légers */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id={`dots-${article.slug}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.2" fill="rgba(255,255,255,0.16)" />
          </pattern>
        </defs>
        <rect x="210" y="0" width="190" height="160" fill={`url(#dots-${article.slug})`} />
        <g fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5">
          <circle cx="55" cy="170" r="60" />
          <circle cx="55" cy="170" r="90" />
          <circle cx="55" cy="170" r="120" />
        </g>
        <path d="M-10 128 Q 120 88 220 116 T 410 96" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
      </svg>

      {/* Icône de spécialité en filigrane */}
      <div className="absolute -bottom-4 -right-3 text-white/25">
        <Icon name={iconName} className={compact ? "h-16 w-16" : "h-24 w-24"} strokeWidth={1.4} />
      </div>

      {/* Catégorie */}
      {!compact && (
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700 backdrop-blur">
          {article.category}
        </span>
      )}
    </div>
  );
}
