import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

import { CxcWordmark } from "@/components/brand/CxcWordmark";
import { UwDscMark } from "@/components/brand/UwDscMark";
import { CXC_START } from "@/lib/countdown";

import { CountdownBackdrop } from "./CountdownBackdrop";
import { CountdownStage, StageLayer } from "./CountdownStage";
import { CountdownTimer } from "./CountdownTimer";
import { WaitlistModal } from "./WaitlistModal";

/**
 * The pre-launch landing page: a 1:1 reproduction of the Figma `Countdown`
 * frame.
 *
 * Kept as a component rather than written straight into `app/page.tsx` so that
 * when the real site launches, swapping it out is a one-line change to the
 * route — and the pieces inside (`CountdownTimer` especially) can be reused on
 * the landing page, e.g. as a "starts in N days" strip.
 *
 * Children sit at their exact design coordinates; `StageLayer` handles scaling
 * the 1280 x 832 frame to the viewport.
 */
export function Countdown() {
  return (
    <CountdownStage>
      <CountdownBackdrop />

      <StageLayer mode="fit">
        {/* `nav bar`: 1280 x 102 with 25px padding; logo-only on this frame. */}
        <header className="absolute" style={{ left: 25, top: 25 }}>
          <UwDscMark />
        </header>

        {/* `cxc logo`: 343 x 100 at (469, 129). */}
        <CxcWordmark className="absolute" style={{ left: 469, top: 129, width: 343 }} />

        {/* `Frame 90`: 932 x 285 at (174, 319). */}
        <CountdownTimer
          target={CXC_START}
          className="absolute"
          style={{ left: 174, top: 319 }}
        />

        {/* `Frame 50`: 233 x 43 at (25, 732) — 8px arrow and 225px button. */}
        <footer className="absolute flex items-center gap-2" style={{ left: 25, top: 732 }}>
          <CaretRightIcon
            aria-hidden
            weight="fill"
            className="ml-[-3%] h-5 w-5 shrink-0 text-primary"
          />
          <WaitlistModal />
        </footer>
      </StageLayer>
    </CountdownStage>
  );
}
