import Link from "next/link";

import { HomeAuthActions } from "@/components/home/HomeAuthActions";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            CxC - UWaterloo Data Science Competition
          </p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">Welcome</h1>
        </div>
        <HomeAuthActions />
      </header>

      <main className="flex flex-1 items-center">
        <div className="flex max-w-lg flex-col gap-6">
          <div className="flex flex-col gap-3 text-sm leading-relaxed">
            <p>
              Apply, compete, and track your progress in UWaterloo&apos;s premier data science
              competition.
            </p>
            <p className="text-muted-foreground">
              Create an account to get started, or sign in if you already have one.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
