"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TravelClubSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call - replace with actual backend integration
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="relative p-8 md:p-12 rounded-2xl border border-border/50 bg-gradient-to-br from-card via-background to-card/50 text-center">
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-primary/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-primary/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-primary/30" />

      <Badge variant="edition" className="mb-4">
        Travel Club
      </Badge>
      <h2 className="font-serif text-3xl md:text-4xl mb-4">Join the Journey</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Join the Travel Club for early access and destination releases.
      </p>

      {status === "success" ? (
        <div className="text-primary font-medium">
          Welcome to the Travel Club. Your journey begins soon.
        </div>
      ) : (
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            required
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Joining..." : "Join Club"}
          </Button>
        </form>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
