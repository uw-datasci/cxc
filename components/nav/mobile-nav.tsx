"use client";

import Link from "next/link";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useState, type MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/components/nav/nav-links";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  function handleSectionLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (window.location.pathname !== "/" || !href.includes("#")) {
      setIsOpen(false);
      return;
    }

    event.preventDefault();
    const hash = href.slice(href.indexOf("#"));
    window.history.pushState(null, "", hash);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  }

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button aria-label="Open navigation menu" size="icon" variant="ghost">
            <ListIcon aria-hidden className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <SheetHeader className="flex-row items-center justify-between">
            <SheetTitle>Navigation</SheetTitle>
            <SheetClose asChild>
              <Button aria-label="Close navigation menu" size="icon" variant="ghost">
                <XIcon aria-hidden className="size-6" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mt-8 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="border-b border-border px-2 py-4 font-mono text-sm tracking-widest uppercase hover:bg-muted"
                href={link.href}
                onClick={(event) => handleSectionLinkClick(event, link.href)}
              >
                [{link.label}]
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
