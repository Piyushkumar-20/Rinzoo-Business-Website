export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-[#0d1f4a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-[#e91e63] flex items-center justify-center animate-pulse">
            <span className="text-2xl font-black text-white" style={{ fontFamily: "cursive" }}>R</span>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-[#e91e63] animate-ping opacity-30" />
        </div>
        <p className="text-white/60 text-sm font-medium tracking-wider">Loading…</p>
      </div>
    </div>
  );
}
