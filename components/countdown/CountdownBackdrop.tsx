import { StageLayer } from "./CountdownStage";
import { FRAME } from "./frame";

/**
 * Everything behind the countdown: the Japan topography, the concentric ring
 * groups, the hairline rules and the small square markers.
 *
 * Every number below is the literal value measured from the Figma frame, in
 * frame pixels.
 *
 * Three layers, which is what Figma's z-order requires: the left ring group
 * sits BEHIND the artwork and the right group in FRONT of it (which is why the
 * left rings are mostly hidden in the mockup). The artwork layer scales to
 * cover while the ring layers fit, so the map reaches the screen edge without
 * the decoration drifting away from the content it belongs to.
 */
export function CountdownBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <StageLayer mode="fit">
        <Canvas>
          {/*
            Left ring group: 514 x 514 at (64, -17), 30% opacity. Seven ellipses
            sharing a centre near (320, 245). Figma greys map onto tokens:
            D9D9D9 / C4C3C1 -> border, 272627 -> dark grey, FFFFFF -> card.
            Ellipse 13 carries a second black stroke, which is what renders.
          */}
          <g fill="none" strokeWidth="1.46" opacity="0.3">
            <circle className="text-border" stroke="currentColor" cx="321" cy="240" r="257" />
            <circle className="text-foreground" stroke="currentColor" cx="320" cy="245.04" r="239.87" />
            <circle className="text-dark-grey" stroke="currentColor" cx="323.02" cy="242.02" r="222.74" />
            <circle className="text-card" stroke="currentColor" cx="318.98" cy="246.05" r="172.34" />
            <circle className="text-border" stroke="currentColor" cx="318.99" cy="246.05" r="156.22" />
            <circle className="text-border" stroke="currentColor" cx="319.99" cy="245.04" r="60.47" />
            <circle className="text-dark-grey" stroke="currentColor" cx="319.99" cy="245.04" r="38.3" />
          </g>
        </Canvas>
      </StageLayer>

      {/*
        Japan topography. Figma clips exports to the frame, so each file is
        already the exact slice that shows: `Group 90` exports at 840 x 832
        (1280 - 440 wide, full frame height) and sits at (440, 0); `Group 91`
        exports at 565 x 573 and sits at the top-left corner.

        This layer covers rather than fits, so the map runs off the screen edge
        instead of stopping short and leaving bare canvas. Because the files are
        frame-clipped there are no pixels beyond x=0 and x=1280 to show, so
        covering is what closes that gap. Re-exporting the groups unclipped
        (their true bounds are 1014.72 x 1125.95) would let this layer fit
        instead and stay perfectly locked to the content.

        Plain <img> rather than next/image: these are SVGs, which next/image
        passes through untouched unless `dangerouslyAllowSVG` is set.
      */}
      <StageLayer mode="cover">
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src="/graphics/topography-right.svg"
          alt=""
          className="absolute"
          style={{ left: 440, top: 0, width: 840, height: 832 }}
        />
        <img
          src="/graphics/topography-left.svg"
          alt=""
          className="absolute"
          style={{ left: 0, top: 0, width: 565, height: 573 }}
        />
        {/* eslint-enable @next/next/no-img-element */}
      </StageLayer>

      <StageLayer mode="fit">
        <Canvas>
          {/* Right ring group: 372 x 372 at (963, 412), 42% opacity. */}
          <g fill="none" strokeWidth="1.46" opacity="0.42">
            <circle className="text-border" stroke="currentColor" cx="1149" cy="598" r="186" />
            <circle className="text-dark-grey" stroke="currentColor" cx="1150.46" cy="599.46" r="161.2" />
            <circle className="text-foreground" stroke="currentColor" cx="1148.27" cy="601.65" r="173.6" />
            <circle className="text-card" stroke="currentColor" cx="1147.54" cy="602.38" r="124.73" />
            <circle className="text-border" stroke="currentColor" cx="1147.54" cy="602.38" r="113.06" />
            <circle className="text-border" stroke="currentColor" cx="1148.28" cy="601.65" r="43.77" />
            <circle className="text-dark-grey" stroke="currentColor" cx="1148.27" cy="601.65" r="27.72" />
          </g>

          {/* Hairline rules, by Figma layer name. */}
          <g className="text-foreground" stroke="currentColor">
            <line x1="838" y1="28" x2="1020" y2="28" strokeWidth="1" />
            <line x1="191" y1="141" x2="373" y2="141" strokeWidth="1" />
            <line x1="1243" y1="184" x2="1243" y2="240" strokeWidth="1" />
            <line x1="30" y1="447" x2="30" y2="639" strokeWidth="0.77" />
            <line x1="1189" y1="446" x2="1189" y2="529" strokeWidth="0.77" />
            <line x1="1206" y1="715" x2="1249" y2="715" strokeWidth="0.77" />
            <line x1="1194" y1="725" x2="1194" y2="768" strokeWidth="0.77" />
          </g>

          {/* 9 x 9 outlined square markers, at their measured positions. */}
          <g className="text-primary" stroke="currentColor" strokeWidth="2">
            <rect x="1030" y="24" width="9" height="9" />
            <rect x="1049" y="24" width="9" height="9" />
            <rect x="1204" y="127" width="9" height="9" />
            <rect x="1239" y="127" width="9" height="9" />
            <rect x="153" y="136" width="9" height="9" />
            <rect x="172" y="136" width="9" height="9" />
            <rect x="1239" y="163" width="9" height="9" />
            <rect x="1185" y="429" width="9" height="9" />
            <rect x="24" y="653" width="9" height="9" />
            <rect x="24" y="669" width="9" height="9" />
            <rect x="24" y="686" width="9" height="9" />
            <rect x="1189" y="710" width="9" height="9" />
          </g>
        </Canvas>
      </StageLayer>
    </div>
  );
}

/**
 * One full-frame SVG, so children can be written in frame coordinates.
 *
 * `overflow-visible` matters: an SVG clips to its viewBox by default, and the
 * right ring group reaches x=1335 — past the frame's 1280. In Figma the frame
 * edge is also the screen edge, so that clip reads as the rings bleeding off.
 * Once the layer is letterboxed inside a wider window, the same clip lands in
 * open space and the rings just stop dead. Letting them overflow keeps them
 * running off the edge the way the design intends.
 */
function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
      width={FRAME.width}
      height={FRAME.height}
      className="absolute inset-0 overflow-visible"
      fill="none"
    >
      {children}
    </svg>
  );
}
