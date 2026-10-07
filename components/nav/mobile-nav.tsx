"use client";

import Link from "next/link";
import { ListIcon, XIcon } from "@phosphor-icons/react";

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
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button aria-label="Open navigation menu" size="icon" variant="ghost">
            <ListIcon aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent aria-describedby={undefined}>
          <SheetHeader className="flex-row items-center justify-between">
            <SheetTitle>Navigation</SheetTitle>
            <SheetClose asChild>
              <Button aria-label="Close navigation menu" size="icon" variant="ghost">
                <XIcon aria-hidden />
              </Button>
            </SheetClose>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mt-8 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="border-b border-border px-2 py-4 font-mono text-sm tracking-widest uppercase hover:bg-muted"
                href={link.href}
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
