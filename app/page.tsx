import { Countdown } from "@/components/countdown/Countdown";

/*
 * The site root is the pre-launch countdown until the real landing page ships.
 *
 * Swapping it is one line: render the launch page here instead. The template's
 * original welcome screen is parked at `app/welcome/page.tsx`.
 */
export default function Page() {
  return <Countdown />;
}
