import Image from "next/image";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";

import type { TeamMember } from "@/lib/constants/team";

/** Keep in sync with the grid columns in `Team`. */
const IMAGE_SIZES =
  "(min-width: 1024px) 16vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { name, role, image } = member;

  return (
    <figure className="group relative aspect-4/5 overflow-hidden bg-border">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes={IMAGE_SIZES}
          className="object-cover object-top"
        />
      ) : (
        <UserIcon
          aria-hidden
          weight="fill"
          className="absolute inset-x-0 bottom-0 mx-auto size-4/5 translate-y-[12%] text-card"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-dark-grey/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
      />

      <figcaption className="absolute inset-x-0 bottom-0 flex flex-col p-4 text-lg text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:bg-dark-grey/80 [@media(hover:none)]:opacity-100">
        <span>{name}</span>
        <span>{role}</span>
      </figcaption>
    </figure>
  );
}
