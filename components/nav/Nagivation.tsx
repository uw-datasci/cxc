"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MobileNav } from "components/nav/MobileNavigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navLinks } from "@/lib/constants/nav";

export function Nav() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < 8) {
        return;
      }

      if (delta > 0 && currentScrollY > 50) {
        setIsVisible(false);
      } else if (delta < 0) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 bg-background transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="flex min-h-18 items-center justify-between gap-8 px-4 py-4 sm:min-h-24 sm:px-6 sm:py-6">
        <Link aria-label="CxC home" className="shrink-0" href="/">
          <Image
            src="/home/dsc-logo.svg"
            alt="UW Data Science Club"
            width={55}
            height={52}
            priority
          />
        </Link>

        <NavigationMenu
          aria-label="Main navigation"
          className="hidden max-w-none flex-1 justify-end lg:flex"
          viewport={false}
        >
          <NavigationMenuList className="gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  asChild
                  className="rounded-none p-0 font-mono text-lg tracking-widest uppercase hover:bg-transparent hover:text-primary focus:bg-transparent"
                >
                  <Link href={link.href}>[{link.label}]</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <MobileNav />
      </div>
    </header>
  );
}
