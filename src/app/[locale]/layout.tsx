import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from "next-intl/server";


export const metadata: Metadata = {
  title: { template: "%s | CMS Blog", default: "Home | CMS Blog" },

};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const {locale} = await params

  //const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className=''
      >
        <NextIntlClientProvider >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
