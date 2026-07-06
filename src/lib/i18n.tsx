"use client";

// Internationalisation FR / AR avec bascule RTL de toute l'interface.
// Les libellés métier bilingues (spécialités, noms) vivent dans data.ts.

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "fr" | "ar";

const DICT: Record<string, { fr: string; ar: string }> = {
  // Navigation & footer
  "nav.search": { fr: "Trouver un médecin", ar: "ابحث عن طبيب" },
  "nav.myAppointments": { fr: "Mes rendez-vous", ar: "مواعيدي" },
  "nav.pro": { fr: "Vous êtes soignant ?", ar: "هل أنت طبيب؟" },
  "nav.account": { fr: "Mon compte", ar: "حسابي" },
  "footer.tagline": { fr: "La santé des Tunisiens, en un clic.", ar: "صحة التونسيين بنقرة واحدة." },
  "footer.patients": { fr: "Patients", ar: "المرضى" },
  "footer.pros": { fr: "Professionnels", ar: "المهنيون" },
  "footer.services": { fr: "Services", ar: "الخدمات" },
  "footer.pricing": { fr: "Tarifs Pro", ar: "أسعار برو" },
  "footer.proLogin": { fr: "Connexion professionnels", ar: "دخول المهنيين" },
  "footer.proNote": {
    fr: "Espaces médecin, clinique et laboratoire — accès réservé après connexion.",
    ar: "فضاءات الطبيب والمصحة والمخبر — دخول محجوز بعد تسجيل الدخول.",
  },
  "footer.searchDoctor": { fr: "Rechercher un médecin", ar: "البحث عن طبيب" },
  "footer.manageAppointments": { fr: "Gérer mes rendez-vous", ar: "إدارة مواعيدي" },
  "footer.joinPro": { fr: "Rejoindre Tabibi Pro", ar: "انضم إلى طبيبي برو" },
  "footer.disclaimer": {
    fr: "Projet de démonstration inspiré de Doctolib, adapté à la Tunisie.",
    ar: "مشروع تجريبي مستوحى من Doctolib ومكيَّف مع تونس.",
  },

  // Accueil
  "home.heroTitle": {
    fr: "Trouvez un médecin en Tunisie et réservez en ligne, 24h/24",
    ar: "ابحث عن طبيب في تونس واحجز عبر الإنترنت على مدار الساعة",
  },
  "home.heroText": {
    fr: "Fini les appels et les files d'attente : recherchez par spécialité et par ville, choisissez un créneau et recevez votre confirmation.",
    ar: "وداعًا للمكالمات وطوابير الانتظار: ابحث حسب الاختصاص والمدينة، اختر موعدًا واحصل على التأكيد فورًا.",
  },
  "home.badge.free": { fr: "✓ Gratuit pour les patients", ar: "✓ مجاني للمرضى" },
  "home.badge.reminders": { fr: "✓ Rappels SMS & e-mail", ar: "✓ تذكير عبر SMS والبريد" },
  "home.badge.tele": { fr: "✓ Téléconsultation", ar: "✓ استشارة عن بُعد" },
  "home.badge.cnam": { fr: "✓ Praticiens conventionnés CNAM", ar: "✓ أطباء متعاقدون مع الصندوق الوطني للتأمين على المرض" },
  "home.specialties": { fr: "Spécialités populaires", ar: "الاختصاصات الأكثر طلبًا" },
  "home.how": { fr: "Comment ça marche ?", ar: "كيف يعمل؟" },
  "home.step1.title": { fr: "Recherchez", ar: "ابحث" },
  "home.step1.text": {
    fr: "Par spécialité, nom ou ville — dans les 24 gouvernorats.",
    ar: "حسب الاختصاص أو الاسم أو المدينة — في كل الولايات الـ24.",
  },
  "home.step2.title": { fr: "Réservez", ar: "احجز" },
  "home.step2.text": {
    fr: "Choisissez un créneau en cabinet ou en téléconsultation, sans appeler.",
    ar: "اختر موعدًا في العيادة أو عن بُعد، دون الحاجة للاتصال.",
  },
  "home.step3.title": { fr: "Consultez", ar: "استشر" },
  "home.step3.text": {
    fr: "Recevez la confirmation et un rappel avant votre rendez-vous.",
    ar: "احصل على التأكيد وتذكير قبل موعدك.",
  },
  "home.available": { fr: "Ils sont disponibles rapidement", ar: "متاحون في أقرب وقت" },
  "home.seeAll": { fr: "Voir tous les praticiens →", ar: "← عرض كل الأطباء" },
  "home.today": { fr: "Aujourd'hui", ar: "اليوم" },
  "home.proBanner.title": {
    fr: "Vous êtes médecin, dentiste ou kiné ?",
    ar: "هل أنت طبيب أو طبيب أسنان أو أخصائي علاج طبيعي؟",
  },
  "home.proBanner.text": {
    fr: "Réduisez les rendez-vous non honorés et remplissez votre agenda avec Tabibi Pro.",
    ar: "قلّل المواعيد الملغاة واملأ جدولك مع طبيبي برو.",
  },
  "home.proBanner.cta": { fr: "Découvrir Tabibi Pro", ar: "اكتشف طبيبي برو" },

  // Recherche
  "search.title": { fr: "Trouver un praticien", ar: "البحث عن طبيب" },
  "search.placeholder": {
    fr: "Nom, spécialité (ex. dentiste, cardiologue…)",
    ar: "الاسم أو الاختصاص (مثال: طبيب أسنان…)",
  },
  "search.allTunisia": { fr: "Toute la Tunisie", ar: "كل تونس" },
  "search.button": { fr: "Rechercher", ar: "بحث" },
  "search.found": { fr: "praticien(s) trouvé(s)", ar: "طبيب/أطباء" },
  "search.for": { fr: "pour", ar: "عن" },
  "search.in": { fr: "à", ar: "في" },
  "search.none1": { fr: "Aucun praticien ne correspond à votre recherche.", ar: "لا يوجد طبيب يطابق بحثك." },
  "search.none2": {
    fr: "Essayez une autre spécialité ou élargissez à « Toute la Tunisie ».",
    ar: "جرّب اختصاصًا آخر أو وسّع البحث إلى « كل تونس ».",
  },

  // Carte praticien / profil
  "card.cnam": { fr: "Conventionné CNAM", ar: "متعاقد مع CNAM" },
  "card.tele": { fr: "📹 Téléconsultation", ar: "📹 استشارة عن بُعد" },
  "card.reviews": { fr: "avis", ar: "تقييم" },
  "card.nextAvail": { fr: "Prochaine disponibilité :", ar: "أقرب موعد متاح:" },
  "card.book": { fr: "Prendre rendez-vous", ar: "حجز موعد" },
  "card.consultPrice": { fr: "Consultation :", ar: "سعر الاستشارة:" },
  "doc.presentation": { fr: "Présentation", ar: "نبذة" },
  "doc.education": { fr: "Formation", ar: "التكوين" },
  "doc.practicalInfo": { fr: "Informations pratiques", ar: "معلومات عملية" },
  "doc.address": { fr: "Adresse", ar: "العنوان" },
  "doc.languages": { fr: "Langues parlées", ar: "اللغات" },
  "doc.payment": { fr: "Moyens de paiement", ar: "طرق الدفع" },
  "doc.paymentText": { fr: "Espèces, carte bancaire", ar: "نقدًا، بطاقة بنكية" },
  "doc.cnamCovered": { fr: ", prise en charge CNAM", ar: "، تغطية CNAM" },
  "doc.basePrice": { fr: "Consultation de base", ar: "استشارة أساسية" },
  "doc.socials": { fr: "Réseaux sociaux", ar: "شبكات التواصل" },
  "doc.location": { fr: "Localisation", ar: "الموقع" },
  "doc.openMaps": { fr: "Ouvrir dans Google Maps →", ar: "← فتح في خرائط جوجل" },
  "doc.gmapsReviews": { fr: "Avis Google", ar: "تقييمات جوجل" },
  "doc.gmapsNote": {
    fr: "Avis de démonstration — la synchronisation en direct nécessite l'API Google Places.",
    ar: "تقييمات تجريبية — المزامنة المباشرة تتطلب واجهة Google Places.",
  },
  "doc.calendly": { fr: "Réserver via Calendly", ar: "الحجز عبر Calendly" },
  "doc.calendlyNote": {
    fr: "Ce praticien synchronise aussi son agenda Calendly.",
    ar: "يزامن هذا الطبيب مواعيده أيضًا عبر Calendly.",
  },

  // Réservation
  "booking.title": { fr: "Prendre rendez-vous", ar: "حجز موعد" },
  "booking.cabinet": { fr: "🏥 Au cabinet", ar: "🏥 في العيادة" },
  "booking.tele": { fr: "📹 Téléconsultation", ar: "📹 عن بُعد" },
  "booking.noSlot": { fr: "Aucun créneau", ar: "لا توجد مواعيد" },
  "booking.chosen": { fr: "Créneau choisi :", ar: "الموعد المختار:" },
  "booking.at": { fr: "à", ar: "على الساعة" },
  "booking.inCabinet": { fr: "au cabinet", ar: "في العيادة" },
  "booking.inTele": { fr: "en téléconsultation", ar: "عن بُعد" },
  "booking.name": { fr: "Nom et prénom *", ar: "الاسم واللقب *" },
  "booking.phone": { fr: "Téléphone (ex. 22 123 456) *", ar: "الهاتف (مثال: 22 123 456) *" },
  "booking.email": { fr: "E-mail (facultatif)", ar: "البريد الإلكتروني (اختياري)" },
  "booking.reason": { fr: "Motif de consultation (facultatif)", ar: "سبب الاستشارة (اختياري)" },
  "booking.confirm": { fr: "Confirmer le rendez-vous", ar: "تأكيد الموعد" },
  "booking.free": {
    fr: "Gratuit et sans engagement — vous pourrez annuler depuis « Mes rendez-vous ».",
    ar: "مجاني ودون التزام — يمكنك الإلغاء من « مواعيدي ».",
  },
  "booking.error": {
    fr: "Merci d'indiquer au minimum votre nom et votre numéro de téléphone.",
    ar: "يرجى إدخال الاسم ورقم الهاتف على الأقل.",
  },
  "booking.loading": { fr: "Chargement des disponibilités…", ar: "جاري تحميل المواعيد…" },
  "booking.slotTaken": {
    fr: "Ce créneau vient d'être réservé par un autre patient — choisissez-en un autre.",
    ar: "تم حجز هذا الموعد للتو من مريض آخر — اختر موعدًا آخر.",
  },

  // Confirmation
  "confirm.title": { fr: "Rendez-vous confirmé !", ar: "تم تأكيد الموعد!" },
  "confirm.sub": {
    fr: "Un rappel vous sera envoyé avant la consultation.",
    ar: "سيتم إرسال تذكير قبل الاستشارة.",
  },
  "confirm.doctor": { fr: "Praticien", ar: "الطبيب" },
  "confirm.datetime": { fr: "Date et heure", ar: "التاريخ والوقت" },
  "confirm.type": { fr: "Type", ar: "النوع" },
  "confirm.cabinet": { fr: "Au cabinet", ar: "في العيادة" },
  "confirm.tele": { fr: "Téléconsultation vidéo", ar: "استشارة فيديو عن بُعد" },
  "confirm.patient": { fr: "Patient", ar: "المريض" },
  "confirm.reason": { fr: "Motif", ar: "السبب" },
  "confirm.myAppts": { fr: "Voir mes rendez-vous", ar: "عرض مواعيدي" },
  "confirm.home": { fr: "Retour à l'accueil", ar: "العودة للرئيسية" },
  "confirm.notFound": { fr: "Rendez-vous introuvable.", ar: "الموعد غير موجود." },
  "confirm.search": { fr: "Rechercher un praticien", ar: "البحث عن طبيب" },

  // Mes rendez-vous
  "mine.title": { fr: "Mes rendez-vous", ar: "مواعيدي" },
  "mine.sub": {
    fr: "Vos réservations sont enregistrées sur cet appareil (démo sans compte).",
    ar: "حجوزاتك محفوظة على هذا الجهاز (نسخة تجريبية دون حساب).",
  },
  "mine.none": { fr: "Vous n'avez pas encore de rendez-vous.", ar: "ليس لديك مواعيد بعد." },
  "mine.find": { fr: "Trouver un praticien", ar: "البحث عن طبيب" },
  "mine.upcomingNone": { fr: "Aucun rendez-vous à venir.", ar: "لا توجد مواعيد قادمة." },
  "mine.cancel": { fr: "Annuler", ar: "إلغاء" },
  "mine.cancelled": { fr: "Annulés", ar: "الملغاة" },
  "mine.cancelledBadge": { fr: "Annulé", ar: "ملغى" },
  "mine.past": { fr: "Historique (rendez-vous passés)", ar: "السجل (المواعيد السابقة)" },
  "mine.review": { fr: "⭐ Laisser un avis vérifié", ar: "⭐ اترك تقييمًا موثّقًا" },
  "mine.rebook": { fr: "Reprendre RDV", ar: "حجز موعد جديد" },
  "mine.join": { fr: "📹 Rejoindre la consultation vidéo", ar: "📹 الانضمام إلى استشارة الفيديو" },

  // Visio
  "visio.title": { fr: "Téléconsultation vidéo", ar: "استشارة فيديو عن بُعد" },
  "visio.with": { fr: "avec", ar: "مع" },
  "visio.info": {
    fr: "Salle vidéo sécurisée (Jitsi Meet). Autorisez caméra et micro, le praticien vous rejoint à l'heure du rendez-vous.",
    ar: "غرفة فيديو آمنة (Jitsi Meet). اسمح بالكاميرا والميكروفون، وسينضم الطبيب في وقت الموعد.",
  },
  "visio.notFound": { fr: "Consultation introuvable.", ar: "الاستشارة غير موجودة." },

  // Compte
  "account.title": { fr: "Mon compte", ar: "حسابي" },
  "account.googleCta": { fr: "Se connecter avec Google", ar: "تسجيل الدخول عبر جوجل" },
  "account.googleNotConfigured": {
    fr: "La connexion Google n'est pas encore activée sur ce déploiement (variables GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET à configurer).",
    ar: "تسجيل الدخول عبر جوجل غير مفعّل بعد في هذا الإصدار (يتطلب إعداد GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).",
  },
  "account.loggedAs": { fr: "Connecté en tant que", ar: "متصل باسم" },
  "account.logout": { fr: "Se déconnecter", ar: "تسجيل الخروج" },
  "account.profileTitle": { fr: "Mon profil patient (local)", ar: "ملفي الشخصي (محلي)" },
  "account.profileText": {
    fr: "Ces informations restent sur cet appareil et pré-remplissent vos réservations.",
    ar: "تبقى هذه المعلومات على هذا الجهاز وتُستخدم لتعبئة الحجوزات مسبقًا.",
  },
  "account.save": { fr: "Enregistrer", ar: "حفظ" },
  "account.saved": { fr: "Profil enregistré ✓", ar: "تم حفظ الملف ✓" },
  "account.whereTitle": { fr: "Où sont enregistrés mes rendez-vous ?", ar: "أين تُحفظ مواعيدي؟" },
  "account.whereText": {
    fr: "Sans compte, vos rendez-vous sont stockés dans le navigateur de cet appareil (localStorage). Avec un compte Google, ils pourront être synchronisés entre vos appareils (fonctionnalité en cours de développement).",
    ar: "بدون حساب، تُحفظ مواعيدك في متصفح هذا الجهاز فقط. مع حساب جوجل، سيمكن مزامنتها بين أجهزتك (قيد التطوير).",
  },

  // Pro
  "pro.kicker": { fr: "Tabibi Pro", ar: "طبيبي برو" },
  "pro.title": {
    fr: "Développez votre patientèle et libérez du temps médical",
    ar: "طوّر قاعدة مرضاك ووفّر وقتًا طبيًا",
  },
  "pro.text": {
    fr: "Rejoignez les praticiens tunisiens qui digitalisent leur cabinet : prise de rendez-vous en ligne 24h/24, rappels automatiques et téléconsultation.",
    ar: "انضم إلى الأطباء التونسيين الذين رقمنوا عياداتهم: حجز عبر الإنترنت على مدار الساعة، تذكيرات تلقائية واستشارات عن بُعد.",
  },
  "pro.demo": { fr: "Demander une démo", ar: "اطلب عرضًا تجريبيًا" },
  "pro.allTitle": {
    fr: "Tout votre cabinet, dans une seule plateforme",
    ar: "عيادتك بأكملها في منصة واحدة",
  },
  "pro.contactTitle": { fr: "Intéressé(e) ? Parlons-en", ar: "مهتم؟ لنتحدث" },
  "pro.contactText": {
    fr: "Laissez vos coordonnées : notre équipe vous recontacte sous 24 h ouvrées. (Formulaire de démonstration — l'envoi n'est pas encore branché.)",
    ar: "اترك بياناتك وسيتواصل معك فريقنا خلال 24 ساعة عمل. (نموذج تجريبي — الإرسال غير مفعّل بعد.)",
  },
  "pro.name": { fr: "Nom et prénom", ar: "الاسم واللقب" },
  "pro.specialty": { fr: "Spécialité", ar: "الاختصاص" },
  "pro.phone": { fr: "Téléphone", ar: "الهاتف" },
  "pro.email": { fr: "E-mail", ar: "البريد الإلكتروني" },
  "pro.submit": { fr: "Être recontacté(e)", ar: "اتصلوا بي" },
  "pro.explore": { fr: "Ou explorez la plateforme côté patient :", ar: "أو استكشف المنصة من جهة المريض:" },

  "nav.dossier": { fr: "Mon dossier médical", ar: "ملفي الطبي" },
  "nav.pharmacies": { fr: "Pharmacies de garde", ar: "صيدليات الحراسة" },
  "nav.queue": { fr: "File d'attente", ar: "طابور الانتظار" },
  "nav.labo": { fr: "Portail laboratoire", ar: "بوابة المخابر" },
  "nav.medicines": { fr: "Base de médicaments", ar: "قاعدة الأدوية" },
  "nav.magazine": { fr: "Magazine Santé", ar: "مجلة الصحة" },
  "nav.qna": { fr: "Questions", ar: "أسئلة" },
  "nav.labs": { fr: "Laboratoires", ar: "المخابر" },
  "footer.positioning": {
    fr: "Le système d'exploitation de la santé tunisienne.",
    ar: "نظام التشغيل للصحة التونسية.",
  },

  // Cliniques
  "nav.clinics": { fr: "Cliniques", ar: "المصحات" },
  "clinics.title": { fr: "Cliniques partenaires", ar: "المصحات الشريكة" },
  "clinics.sub": {
    fr: "Chirurgie, dialyse, maternité, check-up : des établissements privés pour tous les patients — comparez, demandez un devis et réservez leurs praticiens en ligne (données de démonstration).",
    ar: "جراحة، تصفية الدم، ولادة، فحوصات: مصحات خاصة لكل المرضى — قارن، اطلب تسعيرة واحجز لدى أطبائها عبر الإنترنت (بيانات تجريبية).",
  },
  "clinics.libyaTitle": {
    fr: "Patients internationaux",
    ar: "المرضى الدوليون",
  },
  "clinics.libyaText": {
    fr: "Les cliniques accueillent aussi les patients venant de l'étranger — notamment de Libye 🇱🇾 et d'Algérie : devis avant le départ, accueil en arabe, coordination du séjour et suivi à distance par téléconsultation après le retour.",
    ar: "تستقبل المصحات أيضًا المرضى القادمين من الخارج — خاصة من ليبيا 🇱🇾 والجزائر: تسعيرة قبل السفر، استقبال بالعربية، تنسيق الإقامة ومتابعة عن بُعد بعد العودة.",
  },
  "clinics.doctors": { fr: "Praticiens de la clinique", ar: "أطباء المصحة" },
  "clinics.disclaimer": {
    fr: "Cliniques fictives présentées à titre de démonstration.",
    ar: "مصحات وهمية معروضة للتوضيح فقط.",
  },
  "home.clinicsTitle": { fr: "Cliniques privées", ar: "المصحات الخاصة" },
  "home.clinicsText": {
    fr: "Chirurgie, dialyse, maternité, check-up : comparez les cliniques, demandez un devis et réservez leurs praticiens. Guichet dédié pour les patients venant de l'étranger.",
    ar: "جراحة، تصفية الدم، ولادة، فحوصات: قارن المصحات، اطلب تسعيرة واحجز لدى أطبائها. مكتب مخصص للمرضى القادمين من الخارج.",
  },
  "home.clinicsCta": { fr: "Voir les cliniques →", ar: "← عرض المصحات" },

  "common.loading": { fr: "Chargement…", ar: "جاري التحميل…" },
};

export const WEEKDAYS: Record<Locale, string[]> = {
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};

export const MONTHS: Record<Locale, string[]> = {
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  ar: ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};

export const CITY_AR: Record<string, string> = {
  Tunis: "تونس",
  Ariana: "أريانة",
  "Ben Arous": "بن عروس",
  "La Marsa": "المرسى",
  Sfax: "صفاقس",
  Sousse: "سوسة",
  Monastir: "المنستير",
  Nabeul: "نابل",
  Bizerte: "بنزرت",
  Gabès: "قابس",
  Kairouan: "القيروان",
  Gafsa: "قفصة",
  Djerba: "جربة",
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  /** Nom de ville localisé */
  city: (name: string) => string;
  dir: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "fr",
  setLocale: () => {},
  t: (k) => DICT[k]?.fr ?? k,
  city: (n) => n,
  dir: "ltr",
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem("tabibi.locale");
    if (saved === "ar" || saved === "fr") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value: LocaleContextValue = {
    locale,
    setLocale: (l) => {
      setLocaleState(l);
      window.localStorage.setItem("tabibi.locale", l);
    },
    t: (key) => DICT[key]?.[locale] ?? DICT[key]?.fr ?? key,
    city: (name) => (locale === "ar" ? CITY_AR[name] ?? name : name),
    dir: locale === "ar" ? "rtl" : "ltr",
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
