"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const destinations = [
  {
    name: "Santorini",
    handle: "santorini",
    coordinates: "36.3932° N, 25.4615° E",
    tagline: "Aegean blues and whitewashed dreams",
  },
  {
    name: "Amalfi",
    handle: "amalfi",
    coordinates: "40.6340° N, 14.6027° E",
    tagline: "Coastal elegance carved in stone",
  },
  {
    name: "Kyoto",
    handle: "kyoto",
    coordinates: "35.0116° N, 135.7681° E",
    tagline: "Where tradition breathes",
  },
];

export function PortalMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 text-sm font-medium tracking-wide"
        >
          <Compass className="h-4 w-4" />
          <span className="hidden sm:inline">Portal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="font-serif text-2xl tracking-wide">
            Enter the Portal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your destination
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {destinations.map((destination, index) => (
            <div key={destination.handle}>
              <Link
                href={`/destinations/${destination.handle}`}
                className="group block p-4 -mx-2 rounded-lg transition-colors hover:bg-muted/50"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-xl tracking-wide group-hover:text-primary transition-colors">
                    {destination.name}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground tracking-wider">
                    {destination.coordinates}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {destination.tagline}
                </p>
              </Link>
              {index < destinations.length - 1 && (
                <Separator className="mt-4 bg-border/50" />
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <Link
            href="/travel-club"
            className="block py-2 text-sm font-medium transition-colors hover:text-primary"
          >
            Travel Club
          </Link>
          <Link
            href="/journal"
            className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Journal
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
