
import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export const metadata: Metadata = {
    title: { template: "%s | CMS Blog", default: "Home | CMS Blog" },
};

export default async function LocaleLayout({
    children,
    params
  }: {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
  }) {
    // Ensure that the incoming `locale` is valid
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
      notFound();
    }
   
    return (
      <html lang={locale}>
        <body>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </body>
      </html>
    );
  }