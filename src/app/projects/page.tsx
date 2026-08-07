import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import MediaPlaceholder from "@/components/media/MediaPlaceholder";
import { latestCoverByProjectIds } from "@/lib/gallery";
import { listPublishedProjects } from "@/lib/projects";

export default async function Projects() {
  const projects = await listPublishedProjects();
  const covers = await latestCoverByProjectIds(projects.map((p) => p.id));

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-700">
            Project Portfolio
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ongoing Interventions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover how NEWMAP-EIB is actively transforming communities across
            Plateau State through our targeted environmental projects.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="mx-auto mt-16 max-w-lg text-center text-gray-600">
            Projects will appear here once published by the programme team.
          </p>
        ) : (
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const cover = covers[project.id] ?? null;
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100">
                      {cover ? (
                        <Image
                          src={cover}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <MediaPlaceholder label="No progress photo yet" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <h3 className="text-xl font-semibold leading-8 text-gray-900">
                        {project.title}
                      </h3>
                      <p className="mt-3 flex-1 text-base leading-7 text-gray-600 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="mt-6 flex items-center gap-x-4">
                        <div className="flex-none rounded-full bg-green-50 p-1">
                          {project.progress >= 70 ? (
                            <CheckCircle2
                              className="h-5 w-5 text-green-700"
                              aria-hidden="true"
                            />
                          ) : (
                            <Circle
                              className="h-5 w-5 text-green-700"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="text-sm font-semibold leading-6 text-gray-900">
                          {project.statusLabel ||
                            `${project.progress}% Completed`}
                        </div>
                      </div>
                      <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-700"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
