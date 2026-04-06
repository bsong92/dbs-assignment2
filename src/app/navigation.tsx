"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/add", label: "Add Word" },
  { href: "/vocab", label: "Vocabulary" },
  { href: "/review", label: "Review" },
  { href: "/practice", label: "Practice" },
  { href: "/progress", label: "Progress" },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">
              📖
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-foreground">
                Hanyu Journal
              </span>
              <span className="text-xs font-medium text-muted hidden sm:inline">
                汉语日记
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary bg-primary-light"
                    : "text-muted hover:text-foreground hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
