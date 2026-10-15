"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
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
    <Modal>
      <ModalTrigger asChild>
        <Button
          type="button"
          className="text-lg font-normal uppercase"
          style={{ width: 225, height: 43 }}
        >
          Join waiting list
        </Button>
      </ModalTrigger>

      <ModalContent>
        <ModalHeader>
          <ModalTitle>Join the waiting list</ModalTitle>
          <ModalDescription>
            Enter your email and we&apos;ll let you know when CxC registration opens.
          </ModalDescription>
        </ModalHeader>

        {submitted ? (
          <p role="status" className="font-mono text-sm leading-relaxed">
            Thanks — you are on the CxC waiting list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

            <ModalFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Joining…" : "Join mailing list"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
