// Assistant Tabibi — chatbot FAQ à base de règles (aucune API externe).
// Couvre les parcours patient, praticien et clinique, en français et en arabe.

import type { Locale } from "./i18n";

export interface QA {
  id: string;
  keywords: string[]; // FR + AR, comparés après normalisation
  q: Record<Locale, string>; // libellé de la suggestion
  a: Record<Locale, string>; // réponse
  related: string[]; // suggestions suivantes
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents latins
    .replace(/[ً-ْ]/g, "") // voyelles arabes
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const QAS: QA[] = [
  {
    id: "rdv-comment",
    keywords: ["prendre rendez", "reserver", "comment rdv", "booking", "حجز", "موعد", "كيفاش نحجز", "نحجز"],
    q: { fr: "Comment prendre rendez-vous ?", ar: "كيف أحجز موعدًا؟" },
    a: {
      fr: "Recherchez un praticien par spécialité ou ville, ouvrez son profil, choisissez un créneau dans le calendrier, indiquez votre nom et votre téléphone : la confirmation est instantanée, sans appel. 👉 Page « Trouver un médecin ».",
      ar: "ابحث عن طبيب حسب الاختصاص أو المدينة، افتح ملفه، اختر موعدًا من الرزنامة، أدخل اسمك وهاتفك: التأكيد فوري دون مكالمة. 👉 صفحة « ابحث عن طبيب ».",
    },
    related: ["rdv-annuler", "rdv-gratuit", "visio-comment"],
  },
  {
    id: "rdv-annuler",
    keywords: ["annuler", "annulation", "cancel", "الغاء", "نلغي", "الغى"],
    q: { fr: "Comment annuler un rendez-vous ?", ar: "كيف ألغي موعدًا؟" },
    a: {
      fr: "Ouvrez « Mes rendez-vous » puis cliquez sur « Annuler » à côté du rendez-vous concerné. Pensez à annuler au moins 24 h à l'avance par respect pour le praticien et les autres patients.",
      ar: "افتح « مواعيدي » ثم اضغط « إلغاء » بجانب الموعد. يُستحسن الإلغاء قبل 24 ساعة على الأقل احترامًا للطبيب وبقية المرضى.",
    },
    related: ["rdv-deplacer", "rdv-comment"],
  },
  {
    id: "rdv-deplacer",
    keywords: ["deplacer", "changer date", "reporter", "modifier rendez", "تغيير الموعد", "تاجيل"],
    q: { fr: "Puis-je déplacer un rendez-vous ?", ar: "هل يمكن تأجيل موعد؟" },
    a: {
      fr: "Pour l'instant : annulez depuis « Mes rendez-vous » puis réservez un nouveau créneau. Le déplacement en un clic arrive dans une prochaine version.",
      ar: "حاليًا: ألغِ الموعد من « مواعيدي » ثم احجز موعدًا جديدًا. خاصية التأجيل بنقرة واحدة قادمة قريبًا.",
    },
    related: ["rdv-annuler", "rdv-comment"],
  },
  {
    id: "rdv-rappel",
    keywords: ["rappel", "sms", "notification", "oublier", "تذكير", "رساله"],
    q: { fr: "Vais-je recevoir un rappel ?", ar: "هل سأتلقى تذكيرًا؟" },
    a: {
      fr: "Oui, des rappels SMS et e-mail avant chaque rendez-vous sont prévus (en cours d'activation sur cette version de démonstration).",
      ar: "نعم، تذكيرات عبر SMS والبريد الإلكتروني قبل كل موعد (قيد التفعيل في هذه النسخة التجريبية).",
    },
    related: ["rdv-comment", "plus"],
  },
  {
    id: "rdv-gratuit",
    keywords: ["gratuit", "payer tabibi", "prix service", "combien coute", "مجاني", "بلاش", "الخلاص"],
    q: { fr: "Tabibi est-il gratuit ?", ar: "هل طبيبي مجاني؟" },
    a: {
      fr: "Oui, Tabibi est 100 % gratuit pour les patients. Vous réglez uniquement la consultation au praticien (tarif affiché sur son profil). La plateforme est financée par l'abonnement des praticiens (Tabibi Pro).",
      ar: "نعم، طبيبي مجاني تمامًا للمرضى. تدفع فقط ثمن الاستشارة للطبيب (السعر معروض في ملفه). المنصة ممولة من اشتراك الأطباء (طبيبي برو).",
    },
    related: ["paiement-patient", "plus", "cnam"],
  },
  {
    id: "visio-comment",
    keywords: ["teleconsultation", "video", "visio", "distance", "en ligne consultation", "عن بعد", "فيديو", "استشاره"],
    q: { fr: "Comment marche la téléconsultation ?", ar: "كيف تعمل الاستشارة عن بُعد؟" },
    a: {
      fr: "Choisissez « Téléconsultation » lors de la réservation (praticiens avec le badge 📹). À l'heure du rendez-vous, ouvrez « Mes rendez-vous » → « Rejoindre la consultation vidéo » : la salle vidéo sécurisée s'ouvre dans le navigateur, sans installation. Elle sert au contrôle et au suivi — pas à délivrer des documents.",
      ar: "اختر « استشارة عن بُعد » عند الحجز (الأطباء ذوو الشارة 📹). في وقت الموعد، افتح « مواعيدي » ← « الانضمام إلى استشارة الفيديو »: تفتح غرفة فيديو آمنة في المتصفح دون تثبيت. وهي مخصصة للمراقبة والمتابعة — لا لتسليم الوثائق.",
    },
    related: ["visio-prix", "certificat", "rdv-comment"],
  },
  {
    id: "visio-prix",
    keywords: ["prix teleconsultation", "cout video", "tarif visio", "سعر الاستشاره", "قداش"],
    q: { fr: "Combien coûte une téléconsultation ?", ar: "كم تكلف الاستشارة عن بُعد؟" },
    a: {
      fr: "Le tarif est fixé par chaque praticien et affiché sur son profil (souvent proche du tarif cabinet). Le paiement en ligne sécurisé arrive avec la prochaine version ; en attendant, le règlement se fait selon les modalités du praticien.",
      ar: "يحدد كل طبيب سعره ويُعرض في ملفه (غالبًا قريب من سعر العيادة). الدفع الإلكتروني الآمن قادم في النسخة المقبلة؛ حاليًا يتم الخلاص حسب طريقة الطبيب.",
    },
    related: ["visio-comment", "paiement-patient"],
  },
  {
    id: "certificat",
    keywords: ["certificat", "arret travail", "repos", "attestation", "شهاده طبيه", "شهاده", "راحه"],
    q: { fr: "Puis-je avoir un certificat médical en ligne ?", ar: "هل يمكن الحصول على شهادة طبية عبر الإنترنت؟" },
    a: {
      fr: "Non. En Tunisie, le certificat médical est établi après examen et remis en main propre par le praticien, au cabinet. La téléconsultation sert au contrôle et au suivi ; le médecin garde seulement une trace administrative du certificat dans votre dossier.",
      ar: "لا. في تونس تُحرَّر الشهادة الطبية بعد الفحص وتُسلَّم يدًا بيد في العيادة. الاستشارة عن بُعد للمراقبة والمتابعة فقط؛ ويحتفظ الطبيب بأثر إداري للشهادة في ملفك.",
    },
    related: ["ordonnance", "visio-comment"],
  },
  {
    id: "ordonnance",
    keywords: ["ordonnance", "prescription", "medicament", "renouvellement", "وصفه", "دواء"],
    q: { fr: "Et les ordonnances en ligne ?", ar: "وماذا عن الوصفات عبر الإنترنت؟" },
    a: {
      fr: "Comme les certificats, l'ordonnance est remise en main propre au cabinet après examen. Pour un renouvellement, réservez une consultation (ou une téléconsultation de contrôle suivie d'un passage au cabinet). Le texte de l'ordonnance peut être tracé dans votre dossier pour l'historique.",
      ar: "مثل الشهادات، تُسلَّم الوصفة يدًا بيد في العيادة بعد الفحص. لتجديد وصفة، احجز استشارة (أو استشارة مراقبة عن بُعد يتبعها المرور بالعيادة). يمكن حفظ نص الوصفة في ملفك كسجل.",
    },
    related: ["certificat", "dossier-upload"],
  },
  {
    id: "dossier-upload",
    keywords: ["dossier medical", "uploader", "televerser", "analyse", "radio", "pdf", "photo document", "ملف طبي", "تحاليل", "اشعه", "رفع"],
    q: { fr: "Comment remplir mon dossier médical ?", ar: "كيف أملأ ملفي الطبي؟" },
    a: {
      fr: "Ouvrez « Mon dossier médical » : saisissez groupe sanguin, allergies, maladies chroniques et traitements, puis téléversez vos documents (photos ou PDF : ordonnances, analyses, radios). Tout reste sous votre contrôle.",
      ar: "افتح « ملفي الطبي »: أدخل فصيلة الدم والحساسية والأمراض المزمنة والأدوية، ثم ارفع وثائقك (صور أو PDF: وصفات، تحاليل، أشعة). كل شيء يبقى تحت سيطرتك.",
    },
    related: ["dossier-partage", "dossier-securite"],
  },
  {
    id: "dossier-partage",
    keywords: ["partager dossier", "acces medecin", "code acces", "medecin voir", "مشاركه الملف", "رمز", "يشوف ملفي"],
    q: { fr: "Comment le médecin accède-t-il à mon dossier ?", ar: "كيف يطّلع الطبيب على ملفي؟" },
    a: {
      fr: "Vous seul décidez : dans « Mon dossier médical », activez le partage — un code à 6 caractères s'affiche. Donnez-le à votre praticien (au cabinet, en visio ou par message) : il le saisit dans son espace Pro pour consulter votre dossier. Désactivez le partage ou changez le code à tout moment pour couper l'accès.",
      ar: "أنت وحدك من يقرر: في « ملفي الطبي » فعّل المشاركة — يظهر رمز من 6 حروف. أعطه لطبيبك (في العيادة أو عبر الفيديو أو برسالة) ليُدخله في فضائه المهني ويطّلع على ملفك. عطّل المشاركة أو غيّر الرمز في أي وقت لقطع الوصول.",
    },
    related: ["dossier-upload", "dossier-securite"],
  },
  {
    id: "dossier-securite",
    keywords: ["securite", "donnees", "confidentialite", "protection", "inpdp", "prive", "امان", "خصوصيه", "بيانات", "معطيات"],
    q: { fr: "Mes données de santé sont-elles protégées ?", ar: "هل بياناتي الصحية محمية؟" },
    a: {
      fr: "Dans cette démo, vos données restent dans le navigateur de votre appareil — rien n'est envoyé à un serveur. En production : stockage chiffré hébergé en Tunisie, conformité à la loi n° 2004-63 et à l'INPDP, journal des accès praticiens, et suppression à votre demande.",
      ar: "في هذه النسخة التجريبية تبقى بياناتك في متصفح جهازك — لا يُرسل شيء إلى أي خادم. في الإنتاج: تخزين مشفّر في تونس، وفق القانون عدد 63 لسنة 2004 وهيئة حماية المعطيات الشخصية، مع سجل دخول الأطباء والحذف عند الطلب.",
    },
    related: ["dossier-partage", "sans-compte"],
  },
  {
    id: "sans-compte",
    keywords: ["sans compte", "ou enregistre", "sauvegarde", "localstorage", "بدون حساب", "وين تتسجل"],
    q: { fr: "Où sont enregistrés mes rendez-vous sans compte ?", ar: "أين تُحفظ مواعيدي دون حساب؟" },
    a: {
      fr: "Sur cet appareil, dans le stockage du navigateur : ils survivent au rechargement mais ne se synchronisent pas entre appareils et disparaissent si vous videz les données du site. Créez un compte (Google) pour préparer la synchronisation à venir.",
      ar: "على هذا الجهاز، في ذاكرة المتصفح: تبقى بعد إعادة التحميل لكنها لا تتزامن بين الأجهزة وتُمحى إذا مسحت بيانات الموقع. أنشئ حسابًا (جوجل) استعدادًا للمزامنة القادمة.",
    },
    related: ["compte-google", "dossier-securite"],
  },
  {
    id: "compte-google",
    keywords: ["compte", "google", "connexion", "inscription", "login", "حساب", "تسجيل الدخول", "قوقل"],
    q: { fr: "Comment créer un compte ?", ar: "كيف أنشئ حسابًا؟" },
    a: {
      fr: "Cliquez sur l'icône 👤 en haut : vous pouvez vous connecter avec Google en un clic (si activé sur ce déploiement) et remplir votre profil patient qui pré-remplit vos réservations.",
      ar: "اضغط على أيقونة 👤 في الأعلى: يمكنك تسجيل الدخول عبر جوجل بنقرة (إذا كان مفعّلًا) وملء ملفك الشخصي الذي يعبّئ حجوزاتك مسبقًا.",
    },
    related: ["sans-compte", "dossier-upload"],
  },
  {
    id: "langue-arabe",
    keywords: ["arabe", "langue", "francais", "traduction", "عربيه", "اللغه", "فرنسيه", "ترجمه"],
    q: { fr: "Le site existe-t-il en arabe ?", ar: "هل الموقع متوفر بالعربية؟" },
    a: {
      fr: "Oui ! Cliquez sur le bouton « العربية » en haut à droite : toute l'interface bascule en arabe avec une mise en page de droite à gauche. Le bouton « FR » permet de revenir au français.",
      ar: "نعم! الموقع أمامك بالعربية الآن. زر « FR » في الأعلى يعيد الواجهة إلى الفرنسية.",
    },
    related: ["rdv-comment", "app-android"],
  },
  {
    id: "cnam",
    keywords: ["cnam", "rembourse", "conventionne", "assurance", "tiers payant", "الصندوق", "كنام", "تعويض"],
    q: { fr: "Le médecin est-il conventionné CNAM ?", ar: "هل الطبيب متعاقد مع CNAM؟" },
    a: {
      fr: "Les praticiens conventionnés CNAM portent un badge vert « Conventionné CNAM » sur leur profil et dans les résultats de recherche. Présentez votre carnet CNAM au cabinet ; les modalités (APCI, tiers payant, remboursement) dépendent de votre filière.",
      ar: "الأطباء المتعاقدون مع الصندوق الوطني للتأمين على المرض يحملون شارة خضراء « متعاقد مع CNAM » في ملفهم ونتائج البحث. قدّم دفترك في العيادة؛ تختلف الإجراءات (APCI، الدفع من الغير، الاسترجاع) حسب منظومتك.",
    },
    related: ["paiement-patient", "rdv-gratuit"],
  },
  {
    id: "paiement-patient",
    keywords: ["payer consultation", "moyens paiement", "carte", "especes", "edinar", "الدفع", "خلاص", "كاش"],
    q: { fr: "Comment payer la consultation ?", ar: "كيف أدفع ثمن الاستشارة؟" },
    a: {
      fr: "Au cabinet : espèces ou carte selon le praticien (indiqué sur son profil), et prise en charge CNAM s'il est conventionné. Pour la téléconsultation, le paiement en ligne (carte tunisienne via ClicToPay, e-Dinar, Konnect) arrive prochainement.",
      ar: "في العيادة: نقدًا أو بالبطاقة حسب الطبيب (مذكور في ملفه)، مع تغطية CNAM إذا كان متعاقدًا. للاستشارة عن بُعد، الدفع الإلكتروني (بطاقة تونسية عبر ClicToPay أو الدينار الإلكتروني أو Konnect) قادم قريبًا.",
    },
    related: ["cnam", "visio-prix"],
  },
  {
    id: "cliniques",
    keywords: ["clinique", "polyclinique", "hopital", "etablissement", "مصحه", "مستشفى", "عياده خاصه"],
    q: { fr: "Comment trouver une clinique ?", ar: "كيف أجد مصحة؟" },
    a: {
      fr: "Ouvrez la page « Cliniques » : chaque établissement affiche ses spécialités, ses urgences 24h/24, ses praticiens (réservables en ligne) et sa localisation. Les cliniques avec guichet international accueillent les patients venant de l'étranger.",
      ar: "افتح صفحة « المصحات »: كل مؤسسة تعرض اختصاصاتها، الاستعجالي 24/24، أطباءها (قابلين للحجز) وموقعها. المصحات ذات المكتب الدولي تستقبل المرضى القادمين من الخارج.",
    },
    related: ["libye", "rdv-comment"],
  },
  {
    id: "libye",
    keywords: ["libye", "libyen", "etranger", "international", "tripoli", "benghazi", "ليبيا", "ليبي", "طرابلس", "بنغازي", "من الخارج"],
    q: { fr: "Je viens de Libye, comment ça se passe ?", ar: "أنا قادم من ليبيا، كيف تتم الإجراءات؟" },
    a: {
      fr: "Bienvenue ! Les cliniques partenaires disposent d'un guichet dédié : devis avant le voyage, accueil en arabe, coordination hébergement/transport (y compris depuis Ras Jedir), facturation internationale, et suivi par téléconsultation après votre retour. Consultez la page « Cliniques ».",
      ar: "مرحبًا بك! المصحات الشريكة لديها مكتب مخصص: تسعيرة قبل السفر، استقبال بالعربية، تنسيق الإقامة والنقل (بما في ذلك من رأس اجدير)، فوترة دولية، ومتابعة عن بُعد بعد عودتك. راجع صفحة « المصحات ».",
    },
    related: ["cliniques", "visio-comment"],
  },
  {
    id: "urgence",
    keywords: ["urgence", "urgent", "samu", "grave", "douleur poitrine", "accident", "استعجالي", "طوارئ", "خطير", "حادث"],
    q: { fr: "C'est une urgence, que faire ?", ar: "حالة طارئة، ماذا أفعل؟" },
    a: {
      fr: "⚠️ Tabibi ne gère pas les urgences. En cas d'urgence vitale, appelez immédiatement le SAMU au 190 (Protection civile : 198) ou rendez-vous aux urgences les plus proches. Les cliniques avec badge « Urgences 24h/24 » sont listées sur la page Cliniques.",
      ar: "⚠️ طبيبي لا يعالج الحالات الطارئة. في الحالات الخطيرة اتصل فورًا بالإسعاف على الرقم 190 (الحماية المدنية: 198) أو توجّه لأقرب قسم استعجالي. المصحات ذات شارة « استعجالي 24/24 » مدرجة في صفحة المصحات.",
    },
    related: ["cliniques"],
  },
  {
    id: "pharmacie-garde",
    keywords: ["pharmacie", "garde", "nuit", "medicaments acheter", "صيدليه", "حراسه", "ليل"],
    q: { fr: "Où trouver une pharmacie de garde ?", ar: "أين أجد صيدلية الحراسة؟" },
    a: {
      fr: "Ouvrez la page « Pharmacies de garde » (lien en bas de page) : filtrez par ville pour trouver une pharmacie de nuit, de dimanche ou ouverte 24h/24, avec appel et itinéraire en un clic.",
      ar: "افتح صفحة « صيدليات الحراسة » (الرابط أسفل الصفحة): صفِّ حسب المدينة لتجد صيدلية ليلية أو مفتوحة 24/24، مع الاتصال والاتجاهات بنقرة.",
    },
    related: ["urgence", "cliniques"],
  },
  {
    id: "app-android",
    keywords: ["application", "android", "apk", "installer", "telephone", "mobile", "تطبيق", "اندرويد", "تثبيت", "هاتف"],
    q: { fr: "Y a-t-il une application mobile ?", ar: "هل يوجد تطبيق للهاتف؟" },
    a: {
      fr: "Oui : Tabibi s'installe comme une application. Sur Android (Chrome) : menu ⋮ → « Ajouter à l'écran d'accueil ». Sur iPhone (Safari) : Partager → « Sur l'écran d'accueil ». Une version Play Store est en préparation.",
      ar: "نعم: يُثبَّت طبيبي كتطبيق. على أندرويد (كروم): قائمة ⋮ ← « إضافة إلى الشاشة الرئيسية ». على آيفون (سفاري): مشاركة ← « إضافة إلى الشاشة الرئيسية ». نسخة متجر بلاي قيد الإعداد.",
    },
    related: ["langue-arabe", "rdv-comment"],
  },
  {
    id: "pro-inscription",
    keywords: ["je suis medecin", "rejoindre", "inscrire praticien", "dentiste inscription", "referencer", "انا طبيب", "انضمام", "تسجيل طبيب"],
    q: { fr: "Je suis praticien, comment rejoindre Tabibi ?", ar: "أنا طبيب، كيف أنضم إلى طبيبي؟" },
    a: {
      fr: "Bienvenue ! Ouvrez la page « Vous êtes soignant ? » : essayez l'espace praticien en démo, consultez les tarifs, puis laissez vos coordonnées via le formulaire — l'équipe vous recontacte sous 24 h ouvrées pour créer votre profil vérifié.",
      ar: "مرحبًا! افتح صفحة « هل أنت طبيب؟ »: جرّب الفضاء المهني التجريبي، اطّلع على الأسعار، ثم اترك بياناتك في الاستمارة — يتواصل معك الفريق خلال 24 ساعة عمل لإنشاء ملفك الموثّق.",
    },
    related: ["pro-tarifs", "pro-dashboard"],
  },
  {
    id: "pro-tarifs",
    keywords: ["tarif pro", "abonnement", "prix praticien", "combien pro", "اشتراك", "سعر برو", "كم يكلف"],
    q: { fr: "Combien coûte Tabibi Pro ?", ar: "كم يكلف طبيبي برو؟" },
    a: {
      fr: "Trois paliers sans engagement : Essentiel 89 DT/mois (agenda + réservation), Avancé 179 DT/mois (rappels SMS, visio, dossiers, caisse, messagerie), Premium 299 DT/mois (mise en avant, avis Google, widget, multi-assistants). Détails sur la page « Tarifs Pro ».",
      ar: "ثلاث صيغ دون التزام: أساسي 89 د.ت/شهر (جدول + حجز)، متقدم 179 د.ت/شهر (تذكيرات SMS، فيديو، ملفات، صندوق، مراسلة)، بريميوم 299 د.ت/شهر (إبراز في البحث، تقييمات جوجل، أداة الحجز، مساعدين متعددين). التفاصيل في صفحة « الأسعار ».",
    },
    related: ["pro-paiement", "pro-dashboard", "pro-inscription"],
  },
  {
    id: "pro-paiement",
    keywords: ["payer abonnement", "clictopay", "konnect", "edinar pro", "passerelle", "دفع الاشتراك", "كليك تو باي"],
    q: { fr: "Comment payer l'abonnement Pro ?", ar: "كيف أدفع اشتراك برو؟" },
    a: {
      fr: "En ligne, avec les moyens tunisiens : carte bancaire via ClicToPay (Société Monétique Tunisie), e-Dinar de La Poste, ou Konnect. Le virement bancaire annuel est aussi possible (2 mois offerts).",
      ar: "عبر الإنترنت بالوسائل التونسية: بطاقة بنكية عبر ClicToPay (الشركة النقدية التونسية)، الدينار الإلكتروني للبريد، أو Konnect. يمكن أيضًا التحويل البنكي السنوي (شهران مجانًا).",
    },
    related: ["pro-tarifs", "pro-inscription"],
  },
  {
    id: "pro-dashboard",
    keywords: ["espace praticien", "dashboard", "caisse", "dossiers patients", "gestion cabinet", "فضاء الطبيب", "لوحه", "تصرف العياده"],
    q: { fr: "Que contient l'espace praticien ?", ar: "ماذا يحتوي فضاء الطبيب؟" },
    a: {
      fr: "Tout le quotidien du cabinet : agenda des réservations en ligne (avec lancement visio), dossiers patients (antécédents, consultations, traces d'ordonnances et de certificats remis en main propre), caisse (encaissements, impayés, répartition espèces/carte/CNAM), messagerie sécurisée, suivis/relances et consultation des dossiers partagés par les patients. Essayez la démo depuis la page « Vous êtes soignant ? ».",
      ar: "كل يوميات العيادة: جدول الحجوزات (مع إطلاق الفيديو)، ملفات المرضى (السوابق، الاستشارات، آثار الوصفات والشهادات المسلَّمة يدًا بيد)، الصندوق (المقابيض، غير المدفوع، التوزيع نقدًا/بطاقة/CNAM)، مراسلة آمنة، متابعات وتذكيرات، والاطلاع على الملفات التي يشاركها المرضى. جرّب النسخة التجريبية من صفحة « هل أنت طبيب؟ ».",
    },
    related: ["pro-tarifs", "dossier-partage"],
  },
  {
    id: "plus",
    keywords: ["tabibi plus", "premium patient", "famille", "coffre fort", "بلس", "بريميوم", "عائله"],
    q: { fr: "Qu'est-ce que Tabibi Plus ?", ar: "ما هو طبيبي بلس؟" },
    a: {
      fr: "L'offre confort des patients à 9 DT/mois : alerte prioritaire quand un créneau se libère, profils famille (enfants, parents), coffre-fort santé, téléconsultations à tarif réduit, rappels WhatsApp et support prioritaire. L'application de base reste gratuite.",
      ar: "عرض الراحة للمرضى بـ9 د.ت/شهر: تنبيه أولوي عند توفر موعد أقرب، ملفات العائلة (الأبناء والوالدان)، خزنة صحية، استشارات عن بُعد بسعر مخفض، تذكير واتساب ودعم أولوي. التطبيق الأساسي يبقى مجانيًا.",
    },
    related: ["rdv-gratuit", "dossier-upload"],
  },
  {
    id: "attente",
    keywords: ["file attente", "attente cabinet", "mon tour", "queue", "combien attendre", "طابور", "الانتظار", "دوري", "قداش نستنى"],
    q: { fr: "Comment suivre la file d'attente du cabinet ?", ar: "كيف أتابع طابور الانتظار؟" },
    a: {
      fr: "Ouvrez la page « File d'attente » : entrez votre numéro de ticket (remis à l'accueil) pour voir votre position et votre heure de passage estimée en temps réel — et arrivez juste à l'heure.",
      ar: "افتح صفحة « طابور الانتظار »: أدخل رقم تذكرتك (المسلَّمة في الاستقبال) لترى ترتيبك ووقت دخولك المتوقع في الوقت الحقيقي — وتعال في الوقت المناسب.",
    },
    related: ["rdv-comment", "contact"],
  },
  {
    id: "avis",
    keywords: ["avis", "note", "noter", "commentaire", "evaluation", "تقييم", "راي", "نقيم"],
    q: { fr: "Comment laisser un avis sur un médecin ?", ar: "كيف أقيّم طبيبًا؟" },
    a: {
      fr: "Sur le profil du praticien, section « Avis vérifiés Tabibi » : seuls les patients ayant réservé chez ce praticien peuvent publier un avis — c'est notre protection anti-faux-avis. Les avis Google de la fiche du cabinet sont affichés séparément.",
      ar: "في ملف الطبيب، قسم « تقييمات موثّقة من طبيبي »: فقط المرضى الذين حجزوا لديه يمكنهم نشر تقييم — هذه حمايتنا من التقييمات المزيفة. تقييمات جوجل تُعرض على حدة.",
    },
    related: ["rdv-comment", "contact"],
  },
  {
    id: "whatsapp",
    keywords: ["whatsapp", "watsap", "recap", "واتساب", "وتساب"],
    q: { fr: "Puis-je recevoir mon rendez-vous sur WhatsApp ?", ar: "هل يصلني موعدي على واتساب؟" },
    a: {
      fr: "Oui : après la réservation, cliquez sur « Envoyer le récap sur WhatsApp » depuis la page de confirmation pour vous l'envoyer ou le partager à un proche. Les rappels automatiques WhatsApp arrivent avec Tabibi Plus.",
      ar: "نعم: بعد الحجز، اضغط « إرسال الملخص عبر واتساب » من صفحة التأكيد لإرساله لنفسك أو لأحد أقاربك. التذكيرات التلقائية عبر واتساب قادمة مع طبيبي بلس.",
    },
    related: ["rdv-rappel", "plus"],
  },
  {
    id: "labo",
    keywords: ["laboratoire", "labo", "resultat analyse", "imagerie resultat", "مخبر", "نتيجه التحاليل"],
    q: { fr: "Comment recevoir mes résultats d'analyses ?", ar: "كيف أستقبل نتائج تحاليلي؟" },
    a: {
      fr: "Donnez votre code d'accès Tabibi au laboratoire partenaire : il dépose le résultat directement dans « Mon dossier médical » via le Portail laboratoire. Vous pouvez ensuite le partager avec votre médecin.",
      ar: "أعطِ رمز وصولك على طبيبي للمخبر الشريك: يودع النتيجة مباشرة في « ملفي الطبي » عبر بوابة المخابر. يمكنك بعدها مشاركتها مع طبيبك.",
    },
    related: ["dossier-upload", "dossier-partage"],
  },
  {
    id: "devis-clinique",
    keywords: ["devis", "clinique prix", "intervention cout", "operation prix", "تسعيره", "ثمن العمليه", "تكلفه"],
    q: { fr: "Comment demander un devis à une clinique ?", ar: "كيف أطلب تسعيرة من مصحة؟" },
    a: {
      fr: "Ouvrez la fiche de la clinique et remplissez le formulaire « Demander un devis » (besoin, téléphone/WhatsApp, pays) : la clinique vous répond sous 48 h ouvrées avec le devis et les étapes de prise en charge — y compris pour les patients venant de l'étranger.",
      ar: "افتح صفحة المصحة واملأ استمارة « طلب تسعيرة » (الحاجة، الهاتف/واتساب، البلد): تجيبك المصحة خلال 48 ساعة عمل بالتسعيرة وخطوات التكفل — بما في ذلك للمرضى القادمين من الخارج.",
    },
    related: ["cliniques", "libye"],
  },
  {
    id: "medicaments",
    keywords: ["medicament", "prix medicament", "dci", "generique", "doliprane", "دواء", "ثمن الدواء", "جنيس"],
    q: { fr: "Où trouver le prix d'un médicament ?", ar: "أين أجد ثمن دواء؟" },
    a: {
      fr: "Ouvrez la « Base de médicaments » (lien en bas de page) : cherchez par nom, molécule (DCI) ou classe pour voir le prix public en dinars, si une ordonnance est requise, le remboursement CNAM et l'existence d'un générique.",
      ar: "افتح « قاعدة الأدوية » (الرابط أسفل الصفحة): ابحث بالاسم أو المادة الفعالة أو الفئة لتعرف السعر العمومي بالدينار، وهل تلزم وصفة، وتعويض CNAM ووجود دواء جنيس.",
    },
    related: ["pharmacie-garde", "ordonnance"],
  },
  {
    id: "proche",
    keywords: ["proche", "pres de moi", "autour de moi", "geolocalisation", "قريب مني", "بالقرب"],
    q: { fr: "Comment trouver un médecin près de moi ?", ar: "كيف أجد طبيبًا قريبًا مني؟" },
    a: {
      fr: "Sur la page de recherche, touchez « 📍 Autour de moi » et autorisez la localisation : les praticiens sont triés par distance avec les kilomètres affichés.",
      ar: "في صفحة البحث، اضغط « 📍 بالقرب مني » واسمح بتحديد الموقع: يُرتَّب الأطباء حسب المسافة مع عرض الكيلومترات.",
    },
    related: ["rdv-comment", "cliniques"],
  },
  {
    id: "magazine",
    keywords: ["article", "magazine", "conseil sante", "blog", "lire", "مقال", "مجله", "نصائح صحيه"],
    q: { fr: "Où trouver des conseils santé fiables ?", ar: "أين أجد نصائح صحية موثوقة؟" },
    a: {
      fr: "Le « Magazine Santé » de Tabibi publie des articles de prévention clairs (cœur, diabète, enfants, peau, grossesse…), classés par thème, avec un lien direct pour prendre rendez-vous avec le bon spécialiste. Lien en bas de page.",
      ar: "تنشر « مجلة الصحة » على طبيبي مقالات وقاية واضحة (القلب، السكري، الأطفال، البشرة، الحمل…) مصنّفة حسب الموضوع، مع رابط مباشر لحجز موعد لدى المختص المناسب. الرابط أسفل الصفحة.",
    },
    related: ["rdv-comment", "medicaments"],
  },
  {
    id: "laboratoires",
    keywords: ["laboratoire proche", "analyses ou", "prise de sang", "prelevement domicile", "مخبر قريب", "تحاليل وين", "اخذ عينه"],
    q: { fr: "Comment trouver un laboratoire d'analyses ?", ar: "كيف أجد مخبر تحاليل؟" },
    a: {
      fr: "Ouvrez la page « Laboratoires » : filtrez par ville et par type d'analyse (biochimie, hormonologie, bilan prénatal…). Les badges indiquent le prélèvement à domicile et la remise des résultats directement dans votre dossier Tabibi.",
      ar: "افتح صفحة « المخابر »: صفِّ حسب المدينة ونوع التحليل. تشير الشارات إلى أخذ العينات في المنزل وإيداع النتائج مباشرة في ملفك على طبيبي.",
    },
    related: ["labo", "dossier-upload"],
  },
  {
    id: "contact",
    keywords: ["contact", "aide", "humain", "support", "probleme", "reclamation", "تواصل", "مساعده", "مشكل", "شكوى"],
    q: { fr: "Comment contacter un humain ?", ar: "كيف أتواصل مع شخص حقيقي؟" },
    a: {
      fr: "L'équipe support répond par e-mail à support@tabibi.tn (démo) sous 24 h ouvrées, et en priorité pour les abonnés Plus et Pro. Pour toute urgence médicale, appelez le 190 (SAMU).",
      ar: "فريق الدعم يجيب عبر البريد support@tabibi.tn (تجريبي) خلال 24 ساعة عمل، وبأولوية لمشتركي بلس وبرو. في الحالات الطبية الطارئة اتصل بالرقم 190 (الإسعاف).",
    },
    related: ["urgence", "rdv-comment"],
  },
];

/** Suggestions affichées à l'ouverture du chat. */
export const STARTER_IDS = ["rdv-comment", "visio-comment", "dossier-upload", "certificat", "libye", "pro-tarifs"];

export function findAnswer(input: string): QA | null {
  const n = ` ${normalize(input)} `;
  let best: QA | null = null;
  let bestScore = 0;
  for (const qa of QAS) {
    let score = 0;
    for (const kw of qa.keywords) {
      const nkw = normalize(kw);
      if (nkw && n.includes(nkw)) score += nkw.split(" ").length; // les expressions pèsent plus
    }
    if (score > bestScore) {
      bestScore = score;
      best = qa;
    }
  }
  return best;
}

export function byId(id: string): QA | undefined {
  return QAS.find((q) => q.id === id);
}
