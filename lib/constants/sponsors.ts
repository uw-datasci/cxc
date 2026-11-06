export interface SponsorTier {
  id: string;
  label: string;
  slots: number;
  row: string;
  tile: string;
  aspect: string;
  gradient: string;
}

export const SPONSOR_TIERS: readonly SponsorTier[] = [
  {
    id: "platinum",
    label: "Platinum sponsor",
    slots: 1,
    row: "w-full sm:w-[89%]",
    tile: "w-full",
    aspect: "aspect-5/2 sm:aspect-6/1",
    gradient: "linear-gradient(90deg, #bbbbbb 0%, #888888 100%)",
  },
  {
    id: "gold",
    label: "Gold sponsors",
    slots: 2,
    row: "w-full sm:w-[77.2%]",
    tile: "w-full sm:w-[48%]",
    aspect: "aspect-8/3",
    gradient: "linear-gradient(90deg, #ddcda1 0%, #b6963e 100%)",
  },
  {
    id: "silver",
    label: "Silver sponsors",
    slots: 2,
    row: "w-full sm:w-[77.8%]",
    tile: "w-full sm:w-[42.9%]",
    aspect: "aspect-8/3",
    gradient: "linear-gradient(90deg, #999790 0%, #696761 100%)",
  },
  {
    id: "bronze",
    label: "Bronze sponsors",
    slots: 6,
    row: "w-full",
    tile: "w-[47%] sm:w-[29.7%]",
    aspect: "aspect-8/3",
    gradient: "linear-gradient(90deg, #ddc1a1 0%, #b6763e 100%)",
  },
];
