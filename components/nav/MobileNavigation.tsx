"use client";

import Image from "next/image";
import Link from "next/link";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useState, type MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import { PixelReveal } from "./PixelReveal";

const PIXEL_HOLD = "data-[state=closed]:animate-[pixel-hold_400ms_linear_forwards]!";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [closeMode, setCloseMode] = useState<"pixel" | "slide">("pixel");

  function handleOpenChange(open: boolean) {
    if (open) setCloseMode("pixel"); // reset every time the menu opens
    setIsOpen(open);
  }

  function handleSectionLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setCloseMode("slide"); // link click keeps the original slide-out

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
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button aria-label="Open navigation menu" size="icon" variant="ghost">
            <ListIcon aria-hidden className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          aria-describedby={undefined}
          className={cn(
            "w-full! max-w-none p-2 data-[state=open]:animate-none! sm:max-w-none",
            closeMode === "pixel" && PIXEL_HOLD
          )}
          onCloseAutoFocus={(event) => event.preventDefault()}
          showCloseButton={false}
        >
          <PixelReveal open={isOpen} closeEffect={closeMode === "pixel"} />
          <SheetHeader className="flex-row items-center justify-between">
            <Link aria-label="CxC home" className="shrink-0" href="/">
              <Image
                src="/home/cxc-logo.svg"
                alt="UW Data Science Club"
                width={75}
                height={27}
                priority
                className="brightness-0"
              />
            </Link>
            <SheetClose asChild>
              <Button aria-label="Close navigation menu" size="icon" variant="ghost">
                <XIcon aria-hidden className="size-6" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mt-8 flex flex-col px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="border-b border-border px-4 py-4 font-mono text-sm tracking-widest uppercase hover:bg-muted"
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
