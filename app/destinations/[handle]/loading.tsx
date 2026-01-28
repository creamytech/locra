export default function DestinationLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero skeleton */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl space-y-4">
            <div className="h-5 w-40 bg-muted rounded-full animate-pulse" />
            <div className="h-12 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Products grid skeleton */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] rounded-t-full bg-muted animate-pulse" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
