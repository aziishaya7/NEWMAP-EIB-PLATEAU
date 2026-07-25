import UploadModerationList from "@/components/admin/UploadModerationList";
import { listPendingGalleryItems } from "@/lib/gallery";

export default async function AdminUploadsPage() {
  const items = await listPendingGalleryItems();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Upload moderation</h2>
        <p className="mt-1 text-sm text-gray-600">
          Approve or reject progress images before they appear publicly.
        </p>
      </div>
      <UploadModerationList items={items} />
    </div>
  );
}
