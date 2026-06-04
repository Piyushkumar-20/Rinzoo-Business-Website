import { ContentManager } from "@/components/admin/content/ContentManager";

export const metadata = { title: "Content Manager — Rinzoo Admin" };

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit homepage sections — headings, text, button links, images, and visibility. Changes go live within an hour (or instantly on next deploy/cache refresh).
        </p>
      </div>
      <ContentManager />
    </div>
  );
}
