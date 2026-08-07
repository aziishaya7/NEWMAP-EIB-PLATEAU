import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import ProjectProgressTimeline from "@/components/projects/ProjectProgressTimeline";
import { listApprovedProgressForProject } from "@/lib/gallery";
import { getPublishedProjectById } from "@/lib/projects";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getPublishedProjectById(id);
  if (!project) notFound();

  const progressItems = await listApprovedProgressForProject(project.id);

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-8">
          <Link
            href="/projects"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            ← Back to projects
          </Link>
        </p>

        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {project.title}
          </h1>
          {project.description ? (
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {project.description}
            </p>
          ) : null}

          <div className="mt-8 flex items-center gap-x-4">
            <div className="flex-none rounded-full bg-green-50 p-1">
              {project.progress >= 70 ? (
                <CheckCircle2
                  className="h-5 w-5 text-green-700"
                  aria-hidden="true"
                />
              ) : (
                <Circle className="h-5 w-5 text-green-700" aria-hidden="true" />
              )}
            </div>
            <div className="text-sm font-semibold leading-6 text-gray-900">
              {project.statusLabel || `${project.progress}% Completed`}
            </div>
          </div>
          <div className="mt-4 h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-green-700 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Progress timeline
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
            Development photos for this project. Tap or click an image to view
            it larger.
          </p>
          <ProjectProgressTimeline items={progressItems} />
        </section>
      </div>
    </div>
  );
}
