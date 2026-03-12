import { CheckCircle2, Circle } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Jos North Flood Control Project",
      status: "75% Completed",
      description: "Construction of primary and secondary storm water drains to mitigate severe flooding affecting over 500 households.",
      progress: 75,
    },
    {
      id: 2,
      title: "Shendam Watershed Stabilization",
      status: "60% Completed",
      description: "Restoration of degraded lands through afforestation and the implementation of soil bioengineering techniques to control gullies.",
      progress: 60,
    },
    {
      id: 3,
      title: "Community Environmental Awareness Program",
      status: "Ongoing",
      description: "Sensitizing local communities on solid waste management and sustainable land use practices.",
      progress: 40,
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-700">Project Portfolio</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ongoing Interventions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover how NEWMAP-EIB is actively transforming communities across Plateau State through our targeted environmental projects.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-lg">
                <h3 className="text-xl font-semibold leading-8 text-gray-900">{project.title}</h3>
                <p className="mt-4 text-base leading-7 text-gray-600 flex-1">{project.description}</p>
                <div className="mt-6 flex items-center gap-x-4">
                  <div className="flex-none rounded-full bg-green-50 p-1">
                    {project.progress >= 70 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-700" aria-hidden="true" />
                    ) : (
                      <Circle className="h-5 w-5 text-green-700" aria-hidden="true" />
                    )}
                  </div>
                  <div className="text-sm font-semibold leading-6 text-gray-900">{project.status}</div>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-700"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
