"use client";

import {
  DiscordLogoIcon,
  InstagramLogoIcon,
  XLogoIcon,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

interface SocialLink {
  label: string;
  href: string;
  icon: PhosphorIcon;
  weight: "regular" | "fill";
  /** Platform brand colour on hover. */
  hoverClassName: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "X",
    href: "https://twitter.com/uwaterloodsc",
    icon: XLogoIcon,
    weight: "regular",
    hoverClassName: "hover:text-white",
  },
  {
    label: "Discord",
    href: "https://discord.gg/2gBB3ufyCR",
    icon: DiscordLogoIcon,
    weight: "regular",
    hoverClassName: "hover:text-[#5865F2]",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/uwaterloodsc/",
    icon: InstagramLogoIcon,
    weight: "regular",
    hoverClassName: "hover:text-[#FF0069]",
  },
];

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className = "" }: SocialLinksProps) {
  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map(({ label, href, icon: Icon, weight, hoverClassName }) => (
        <li key={label}>
          <Button
            asChild
            size="icon"
            className={`size-18 rounded-full bg-white/10 text-background transition-colors hover:bg-white/20 ${hoverClassName}`}
          >
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon aria-hidden weight={weight} className="size-10" />
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}
