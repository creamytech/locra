import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortalArch } from "@/components/portal/PortalArch";

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <PortalArch size="md" glowEnabled={false} className="mx-auto mb-8">
          <div className="flex items-center justify-center text-stone-400">
            <span className="font-serif text-4xl">?</span>
          </div>
        </PortalArch>

        <h1 className="font-serif text-3xl mb-4">Artifact Not Found</h1>

        <p className="text-muted-foreground mb-8">
          This piece has either been claimed or has not yet been catalogued in
          our collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Return to Atlas</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/destinations/santorini">Browse Collection</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
