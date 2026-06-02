import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 mb-4">
          <span className="text-3xl font-bold text-white">R</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Rinzoo</h1>
        <p className="text-gray-500">Premium Results, Smart Pricing</p>
        <p className="text-sm text-gray-400">Public website coming in Phase 2</p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Go to Admin Panel →
        </Link>
      </div>
    </div>
  );
}
