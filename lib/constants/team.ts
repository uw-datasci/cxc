export interface TeamMember {
  id: string;
  name: string;
  /* Shown on hover */
  role: string;
  image?: string;
}
export interface TeamGroup {
  id: string;
  title: string;
  members: readonly TeamMember[];
}

export const TEAM_GROUPS: readonly TeamGroup[] = [
  {
    id: "vps",
    title: "VP of CxC",
    members: [
      { id: "vp-1", name: "Firstname Lastname", role: "VP of CxC" },
      { id: "vp-2", name: "Firstname Lastname", role: "VP of CxC" },
    ],
  },
  {
    id: "execs",
    title: "Execs",
    members: [
      { id: "exec-1", name: "Firstname Lastname", role: "Exec" },
      { id: "exec-2", name: "Firstname Lastname", role: "Exec" },
      { id: "exec-3", name: "Firstname Lastname", role: "Exec" },
      { id: "exec-4", name: "Firstname Lastname", role: "Exec" },
    ],
  },
  {
    id: "advisors",
    title: "Advisors",
    members: [
      { id: "advisor-1", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-2", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-3", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-4", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-5", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-6", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-7", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-8", name: "Firstname Lastname", role: "Advisor" },
      { id: "advisor-9", name: "Firstname Lastname", role: "Advisor" },
    ],
  },
  {
    id: "outreach",
    title: "Outreach",
    members: [
      { id: "outreach-1", name: "Firstname Lastname", role: "Outreach" },
      { id: "outreach-2", name: "Firstname Lastname", role: "Outreach" },
      { id: "outreach-3", name: "Firstname Lastname", role: "Outreach" },
    ],
  },
];
