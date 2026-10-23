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
}


const SOCIAL_LINKS: SocialLink[] = [
  { label: "X", href: "https://twitter.com/uwaterloodsc", icon: XLogoIcon, weight: "regular" },
  {
    label: "Discord",
    href: "https://discord.gg/2gBB3ufyCR",
    icon: DiscordLogoIcon,
    weight: "regular",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/uwaterloodsc/",
    icon: InstagramLogoIcon,
    weight: "regular",
  },
];

interface SocialLinksProps {
  className?: string;
}

// Row of circular social buttons.
export function SocialLinks({ className = "" }: SocialLinksProps) {
  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map(({ label, href, icon: Icon, weight }) => (
        <li key={label}>
          <Button
            asChild
            size="icon"
            className="size-18 rounded-full bg-white/10 text-background hover:bg-white/20"
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
