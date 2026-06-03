export default function MarketingLoading() {
  return (
    <div className="flex items-center justify-center py-40">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="size-12 rounded-xl bg-[#2b7fff] flex items-center justify-center animate-pulse">
            <span className="text-2xl font-black text-white">R</span>
          </div>
          <div className="absolute inset-0 rounded-xl bg-[#2b7fff] animate-ping opacity-30" />
        </div>
        <p className="text-[#a1a1a1] text-sm font-medium tracking-wider">Loading…</p>
      </div>
    </div>
  );
}
