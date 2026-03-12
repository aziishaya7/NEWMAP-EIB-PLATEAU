import Link from "next/link";
import { ArrowRight, Leaf, Droplets, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#166534] to-[#2563eb] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Protecting Plateau State&apos;s Environment
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Welcome to NEWMAP-EIB Plateau State. We are committed to environmental protection, erosion control, flood management, and sustainable development across the region.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/projects" className="rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 flex items-center gap-2">
                View Ongoing Projects <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-700">Our Mission</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sustainable interventions for a secure future
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Through targeted projects and community participation, we address the root causes of land degradation to create safer environments for all residents of Plateau State.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-700">
                  <Leaf className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Erosion Control
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Implementing vegetative and structural measures to halt severe gully erosion and reclaim degraded lands.</dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Droplets className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Flood Management
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Developing resilient drainage networks and early warning systems to mitigate the impact of seasonal flooding.</dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-800">
                  <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Community Resilience
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Empowering local communities through awareness programs and sustainable livelihood support initiatives.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
