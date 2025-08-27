import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APEXCARD - 您的专业数字名片解决方案",
  description: "创建、管理和分享您的数字名片。支持多种社交平台整合，专业模板设计，一键分享功能。",
  keywords: ["数字名片", "商务名片", "APEXCARD", "电子名片", "名片管理", "社交整合"],
  authors: [{ name: "APEXCARD Team" }],
  openGraph: {
    title: "APEXCARD - 专业数字名片解决方案",
    description: "创建、管理和分享您的数字名片",
    url: "https://apexcard.com",
    siteName: "APEXCARD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APEXCARD - 专业数字名片解决方案",
    description: "创建、管理和分享您的数字名片",
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "APEXCARD",
    "application-name": "APEXCARD",
    "apple-touch-icon": "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProviderWrapper>
          <AuthProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </SessionProviderWrapper>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
