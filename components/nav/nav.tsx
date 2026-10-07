import Link from "next/link";
import Image from "next/image";

import { MobileNav } from "@/components/nav/mobile-nav";
import { navLinks } from "@/components/nav/nav-links";

export function Nav() {
  return (
    <header className="relative border-b border-border bg-background">
      <div className="flex min-h-18 items-center justify-between gap-8 px-4 py-4 sm:min-h-24 sm:px-6 sm:py-6">
        <Link aria-label="CxC home" className="shrink-0" href="/">
          <Image
            src="/logo/uw-dsc-logo.svg"
            alt="UW Data Science Club"
            width={55}
            height={52}
            priority
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex lg:gap-12"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="font-mono text-lg tracking-widest uppercase hover:text-primary"
              href={link.href}
            >
              [{link.label}]
            </Link>
          ))}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
