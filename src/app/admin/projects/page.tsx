import ProjectsManager from "@/components/admin/ProjectsManager";
import { listAllProjects } from "@/lib/projects";

export default async function AdminProjectsPage() {
  const projects = await listAllProjects();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage the public project portfolio.
        </p>
      </div>
      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
