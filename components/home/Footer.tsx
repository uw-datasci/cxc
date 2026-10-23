import Image from "next/image";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer>
      {/* Replace width/height with your SVG's real dimensions (they set the aspect ratio). */}
      <Image
        src="/home/footer-terrain.svg"
        alt=""
        width={1442}
        height={406}
        className="block h-auto w-full"
      />

      <div className="-mt-40 flex min-h-120 flex-col justify-center bg-terrain text-background">
        <div className="max-w-7xl px-10 sm:px-18 mt-22">
          <p className="font-mono text-5xl leading-none font-semibold uppercase sm:text-6xl">
            Follow us
          </p>
          <p className="mt-3 font-mono text-sm tracking-wide uppercase sm:text-xl">
            Stay informed on the latest updates
          </p>

          <SocialLinks className="mt-8" />
        </div>
      </div>
    </footer>
  );
}
