export default function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Fake Category Header */}
      <div className="h-8 w-48 rounded-lg bg-stone-200"></div>

      <div className="rounded-2xl border border-stone-100 bg-white p-4">
        {/* Fake Items */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-stone-50 last:border-0">
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-stone-200"></div>
              <div className="h-3 w-24 rounded bg-stone-100"></div>
            </div>
            <div className="h-8 w-16 rounded bg-stone-100"></div>
          </div>
        ))}
      </div>
    </div>
  );
}