export default function ProductLoading() {
  return (
    <div className="flex flex-col">
      {/* Breadcrumb skeleton */}
      <div className="container-wide py-4 border-b border-border/50">
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>

      {/* Main content skeleton */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Image skeleton */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-t-full bg-muted animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Right: Details skeleton */}
            <div className="lg:py-8 space-y-6">
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-px bg-border" />
              <div className="h-12 w-full bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
