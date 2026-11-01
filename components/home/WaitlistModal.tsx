"use client";

import { useState } from "react";
import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist } from "@/lib/api/waitlist";

/**
 * Collects a waitlist email and reports pending, success, and failure states.
 *
 * The server intentionally makes duplicate submissions indistinguishable from
 * new submissions, so the same success message is shown for both.
 */
export function WaitlistModal() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      await joinWaitlist(email);
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Could not join the waiting list."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="h-10 w-fit text-lg font-normal uppercase">
          <CaretRightIcon
            aria-hidden
            weight="fill"
            className="size-4 text-primary-foreground"
          />
          Join waiting list
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the waiting list</DialogTitle>
          <DialogDescription>
            Enter your email and we&apos;ll let you know when CxC registration opens.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col gap-4 bg-dark-grey p-5 text-primary-foreground"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-header-sub font-bold uppercase">You&apos;re on the list</h3>
                <CheckIcon aria-hidden weight="bold" className="size-6 shrink-0" />
              </div>
              <p className="font-mono text-sm leading-relaxed">
                Thanks for joining the CxC waiting list. You&apos;ll receive a confirmation
                email shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="waitlist-email"
                className="font-mono text-sm tracking-widest uppercase"
              >
                Email address
              </Label>
              <Input
                id="waitlist-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={pending}
                required
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Joining…" : "Join mailing list"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
