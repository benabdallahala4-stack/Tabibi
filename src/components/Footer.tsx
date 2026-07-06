"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Seha" className="h-8 w-8" />
            <span className="font-bold text-primary-700">Seha</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            {t("footer.tagline")}
            <br />
            <span className="font-medium text-primary-700">{t("footer.positioning")}</span>
            <br />
            <span dir="rtl">صحتك أولويتنا</span>
          </p>
        </div>

        {/* Patients — pages publiques */}
        <div className="text-sm">
          <h3 className="font-semibold text-slate-700">{t("footer.patients")}</h3>
          <ul className="mt-3 space-y-2 text-slate-500">
            <li><Link href="/recherche" className="hover:text-primary-600">{t("footer.searchDoctor")}</Link></li>
            <li><Link href="/mes-rdv" className="hover:text-primary-600">{t("footer.manageAppointments")}</Link></li>
            <li><Link href="/dossier" className="hover:text-primary-600">{t("nav.dossier")}</Link></li>
            <li><Link href="/questions" className="hover:text-primary-600">{t("nav.qna")}</Link></li>
            <li><Link href="/sante" className="hover:text-primary-600">{t("nav.magazine")}</Link></li>
            <li><Link href="/plus" className="hover:text-primary-600">Seha Plus</Link></li>
          </ul>
        </div>

        {/* Services — pages publiques */}
        <div className="text-sm">
          <h3 className="font-semibold text-slate-700">{t("footer.services")}</h3>
          <ul className="mt-3 space-y-2 text-slate-500">
            <li><Link href="/cliniques" className="hover:text-primary-600">{t("nav.clinics")}</Link></li>
            <li><Link href="/laboratoires" className="hover:text-primary-600">{t("nav.labs")}</Link></li>
            <li><Link href="/pharmacies" className="hover:text-primary-600">{t("nav.pharmacies")}</Link></li>
            <li><Link href="/medicaments" className="hover:text-primary-600">{t("nav.medicines")}</Link></li>
            <li><Link href="/attente" className="hover:text-primary-600">{t("nav.queue")}</Link></li>
            <li><Link href="/compte" className="hover:text-primary-600">{t("nav.account")}</Link></li>
          </ul>
        </div>

        {/* Professionnels — accès réservé (connexion requise) */}
        <div className="text-sm">
          <h3 className="font-semibold text-slate-700">{t("footer.pros")}</h3>
          <ul className="mt-3 space-y-2 text-slate-500">
            <li><Link href="/pro" className="hover:text-primary-600">{t("footer.joinPro")}</Link></li>
            <li><Link href="/pro/tarifs" className="hover:text-primary-600">{t("footer.pricing")}</Link></li>
            <li>
              <Link href="/connexion" className="inline-flex items-center gap-1.5 font-medium text-primary-600 hover:text-primary-700">
                🔒 {t("footer.proLogin")}
              </Link>
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-400">{t("footer.proNote")}</p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Seha — {t("footer.disclaimer")}
      </div>
    </footer>
  );
}
