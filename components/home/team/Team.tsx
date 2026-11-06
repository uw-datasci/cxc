import { SectionBar } from "@/components/ui/section-bar";
import { TEAM_GROUPS } from "@/lib/constants/team";
import { TeamMemberCard } from "./TeamMemberCard";

const TEAM_ENTRIES = TEAM_GROUPS.flatMap((group) =>
  group.members.map((member, index) => ({
    key: `${group.id}/${member.id}`,
    member,
    groupTitle: index === 0 ? `${group.title} ${group.members.length}` : undefined,
  }))
);

export function Team() {
  return (
    <section id="team" className="py-10">
      <SectionBar number="05" title="Our Team" />

      <div className="mx-auto mt-24 max-w-7xl pb-24">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TEAM_ENTRIES.map(({ key, member, groupTitle }) => (
            <li key={key} className="relative">
              {groupTitle && (
                <p className="absolute bottom-full mb-3 font-mono text-lg leading-none tracking-widest whitespace-nowrap uppercase">
                  {groupTitle}
                </p>
              )}
              <TeamMemberCard member={member} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
