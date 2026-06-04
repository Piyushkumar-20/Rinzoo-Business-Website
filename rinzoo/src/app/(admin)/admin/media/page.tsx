import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";

export const metadata = { title: "Media Library — Rinzoo Admin" };

export default function MediaPage() {
  const cloudinaryReady = isCloudinaryConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
        <p className="text-sm text-gray-500 mt-1">Upload, preview, and manage all images used across the website.</p>
      </div>
      <MediaLibrary cloudinaryReady={cloudinaryReady} />
    </div>
  );
}
