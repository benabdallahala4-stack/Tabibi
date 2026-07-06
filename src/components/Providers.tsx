"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/lib/i18n";
import { useEffect } from "react";
import ChatBot from "@/components/ChatBot";

function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <PwaRegister />
        {children}
        <ChatBot />
      </LocaleProvider>
    </SessionProvider>
  );
}
