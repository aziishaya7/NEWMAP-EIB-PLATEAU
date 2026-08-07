import UploadForm from "@/components/upload/UploadForm";
import { listPublishedProjects } from "@/lib/projects";

export default async function UploadProgressPage() {
  const projects = await listPublishedProjects();

  return (
    <div className="min-h-screen bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Report Progress
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Upload a field photo tied to a project and the progress percentage
            at that stage. Non-admin submissions are reviewed before appearing
            publicly.
          </p>
        </div>
        <UploadForm projects={projects} />
      </div>
    </div>
  );
}
