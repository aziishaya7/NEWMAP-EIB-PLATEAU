import { Calendar, Megaphone } from "lucide-react";

export default function News() {
  const newsItems = [
    {
      id: 1,
      title: "NEWMAP-EIB Launches New Flood Mitigation Initiative in Plateau State",
      date: "March 10, 2026",
      summary: "In a collaborative effort with the State Government and the European Investment Bank, a new flagship program has been launched to construct comprehensive drainage networks in prone areas.",
    },
    {
      id: 2,
      title: "Community Stakeholder Engagement Held in Jos South",
      date: "February 24, 2026",
      summary: "Local leaders, civil society organizations, and community members gathered to discuss the integration of sustainable land use practices.",
    },
    {
      id: 3,
      title: "Erosion Control Measures See Positive Results in Shendam",
      date: "January 15, 2026",
      summary: "Recent data shows a significant reduction in topsoil loss following the implementation of vegetative barriers and structural engineering solutions last year.",
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest News & Updates</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Stay informed on our latest activities, announcements, and environmental milestones.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {newsItems.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date} className="text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {post.date}
                </time>
                <div className="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600 hover:bg-blue-100 flex items-center gap-1">
                  <Megaphone className="h-3 w-3" /> Announcement
                </div>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-green-700">
                  <span className="absolute inset-0" />
                  {post.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
