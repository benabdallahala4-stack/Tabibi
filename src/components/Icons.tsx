// Système d'icônes SVG (tracés originaux, style trait 24×24) — remplace les
// emojis pour un rendu professionnel et cohérent.

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export type IconName =
  | "search" | "calendar" | "video" | "shield" | "bell" | "map-pin" | "star"
  | "check" | "arrow-right" | "clock" | "users" | "building" | "flask" | "pill"
  | "phone" | "file" | "message" | "sparkle"
  | "stethoscope" | "tooth" | "heart-pulse" | "droplet" | "venus" | "baby"
  | "eye" | "ear" | "brain" | "bone" | "stomach" | "activity";

const PATHS: Record<IconName, React.ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>),
  video: (<><rect x="2" y="6" width="13" height="12" rx="2" /><path d="m15 10 5-3v10l-5-3" /></>),
  shield: (<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>),
  bell: (<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></>),
  "map-pin": (<><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>),
  star: (<path d="m12 3 2.7 5.6 6.3.9-4.5 4.3 1 6.2L12 17l-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z" />),
  check: (<path d="m4 12.5 5 5L20 7" />),
  "arrow-right": (<path d="M4 12h16m-6-6 6 6-6 6" />),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" /></>),
  building: (<><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M12 8h.01M8 8h.01M16 8h.01M12 12h.01M8 12h.01M16 12h.01M10 21v-4h4v4" /></>),
  flask: (<><path d="M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3" /><path d="M8.5 3h7M7 15h10" /></>),
  pill: (<><rect x="3" y="9.5" width="18" height="8" rx="4" transform="rotate(-40 12 13.5)" /><path d="m8.8 8 6.4 7.5" /></>),
  phone: (<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />),
  file: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>),
  message: (<path d="M21 12a8 8 0 0 1-8 8H4l2.5-3A8 8 0 1 1 21 12Z" />),
  sparkle: (<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" />),
  stethoscope: (<><path d="M5 3v6a5 5 0 0 0 10 0V3" /><path d="M10 14v2a6 6 0 0 0 12 0v-3" /><circle cx="22" cy="10" r="0.5" /><circle cx="22" cy="10" r="2.5" /></>),
  tooth: (<path d="M7 3c2 0 3 1 5 1s3-1 5-1c2.5 0 4 2 4 4.5 0 2-1 3.5-1.6 5.3-.6 1.9-.7 5-1.7 7.4-.4 1-1.8 1-2.2 0-.6-1.7-.8-4.2-1.7-5.7-.4-.7-1.2-.7-1.6 0-.9 1.5-1.1 4-1.7 5.7-.4 1-1.8 1-2.2 0-1-2.4-1.1-5.5-1.7-7.4C4 11 3 9.5 3 7.5 3 5 4.5 3 7 3Z" />),
  "heart-pulse": (<><path d="M12 20S4 14.5 4 9a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 5.5-8 11-8 11Z" /><path d="M5 12h3l1.5-3 3 5 1.5-2h5" /></>),
  droplet: (<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />),
  venus: (<><circle cx="12" cy="8" r="5" /><path d="M12 13v8M9 18h6" /></>),
  baby: (<><circle cx="12" cy="8" r="5" /><path d="M9.5 8h.01M14.5 8h.01M10 10.5s.8 1 2 1 2-1 2-1" /><path d="M6 21c0-3 2.5-5 6-5s6 2 6 5" /></>),
  eye: (<><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>),
  ear: (<><path d="M17 10a5 5 0 0 0-10 0c0 1.5.5 2.4.5 4a4.5 4.5 0 0 0 9 0" /><path d="M13.5 10a1.5 1.5 0 0 0-3 0c0 1 .8 1.3.8 2.5" /></>),
  brain: (<><path d="M9 4a3 3 0 0 0-3 3 3.5 3.5 0 0 0-2 3.5c0 1.2.6 2.2 1.5 2.8A3.5 3.5 0 0 0 8 20c.8 0 1.5-.2 2-.7V5.5A3 3 0 0 0 9 4Z" /><path d="M15 4a3 3 0 0 1 3 3 3.5 3.5 0 0 1 2 3.5c0 1.2-.6 2.2-1.5 2.8A3.5 3.5 0 0 1 16 20c-.8 0-1.5-.2-2-.7V5.5A3 3 0 0 1 15 4Z" /></>),
  bone: (<path d="M17.5 4a2.5 2.5 0 0 0-2 4l-7.5 7.5a2.5 2.5 0 1 0-2.4 4.4A2.5 2.5 0 1 0 10 17.5L17.5 10a2.5 2.5 0 1 0 4.4-2.4A2.5 2.5 0 0 0 17.5 4Z" />),
  stomach: (<path d="M14 3v4a4 4 0 0 0 4 4 3 3 0 0 1 0 6c-4.5 0-6-2-8.5-2A4.5 4.5 0 0 1 5 10.5V8" />),
  activity: (<path d="M3 12h4l3-8 4 16 3-8h4" />),
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE} strokeWidth={strokeWidth ?? STROKE.strokeWidth} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

/** Icône par spécialité (remplace les emojis sur les surfaces "pro"). */
export const SPECIALTY_ICON: Record<string, IconName> = {
  "medecine-generale": "stethoscope",
  dentiste: "tooth",
  cardiologie: "heart-pulse",
  dermatologie: "droplet",
  gynecologie: "venus",
  pediatrie: "baby",
  ophtalmologie: "eye",
  orl: "ear",
  psychiatrie: "brain",
  orthopedie: "bone",
  gastro: "stomach",
  kine: "activity",
};

/* ---- Icônes de marque (réseaux sociaux) ---- */

export function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.5 3h-17A.5.5 0 0 0 3 3.5v17a.5.5 0 0 0 .5.5h17a.5.5 0 0 0 .5-.5v-17a.5.5 0 0 0-.5-.5ZM8.3 18.3H5.7V10h2.6v8.3ZM7 8.9a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.3 9.4h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.6 1-1.6 2.1v4.1h-2.6V10h2.5v1.1h.1a2.7 2.7 0 0 1 2.5-1.3c2.6 0 3.1 1.7 3.1 4v4.5Z" />
    </svg>
  );
}

export function GlobeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
