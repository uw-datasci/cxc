import { AboutUs } from "@/components/landing/about-us";
import { Nav } from "@/components/nav";

export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Nav />
      <main className="flex-1">
        <AboutUs />
      </main>
    </div>
  );
}
