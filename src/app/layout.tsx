import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hanyu Journal | 汉语日记",
  description: "A personal Chinese vocabulary journal for retention and review",
};

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/add", label: "Add Word" },
  { href: "/vocab", label: "Vocabulary" },
  { href: "/review", label: "Review" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="bg-surface border-b border-border sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <span className="text-xl font-bold text-foreground">
                  Hanyu Journal
                </span>
                <span className="text-sm text-muted hidden sm:inline">
                  汉语日记
                </span>
              </Link>
              <div className="flex items-center gap-1 sm:gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        <Providers>
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
        <footer className="border-t border-border py-6 text-center text-sm text-muted">
          Hanyu Journal — Built for learning Chinese, one word at a time.
        </footer>
      </body>
    </html>
  );
}
