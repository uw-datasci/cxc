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

export function WaitlistModal() {
  const [email, setEmail] = useState("");

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

          <ModalFooter>
            <Button type="submit">Join mailing list</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
