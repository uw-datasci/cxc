"use client";

import { useState } from "react";
import { CaretRightIcon } from "@phosphor-icons/react";

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

export function WaitlistModal() {
  const [email, setEmail] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-fit text-lg font-normal uppercase h-10"
        >
          <CaretRightIcon aria-hidden weight="fill" className="size-4 text-primary-foreground" />
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

        <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-6">
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
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit">Join waitling list</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
