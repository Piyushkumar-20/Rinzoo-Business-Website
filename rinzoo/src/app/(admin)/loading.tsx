export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-lg bg-gray-200" />
        <div className="h-4 w-80 rounded bg-gray-100" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200" />
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        <div className="h-10 flex-1 rounded-lg bg-gray-200" />
        <div className="h-10 w-64 rounded-lg bg-gray-200" />
      </div>

      {/* Table/list skeleton */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-3 w-32 rounded bg-gray-100" />
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
