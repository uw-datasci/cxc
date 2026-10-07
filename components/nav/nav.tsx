import Link from "next/link";

import { MobileNav } from "@/components/nav/mobile-nav";
import { navLinks } from "@/components/nav/nav-links";

export function Nav() {
  return (
    <header className="relative border-b border-border bg-background">
      <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-8 px-6 py-4 lg:px-8">
        <Link
          aria-label="CxC home"
          className="text-header-sub leading-[0.8] font-bold uppercase"
          href="/"
        >
          <span className="block">UW</span>
          <span className="block">DSC.</span>
          <span className="block">—</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex lg:gap-12"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="font-mono text-sm tracking-widest uppercase hover:text-primary"
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
