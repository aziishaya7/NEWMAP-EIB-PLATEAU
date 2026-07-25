import { Leaf, Info, ShieldAlert, Droplets } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <p className="text-base font-semibold leading-7 text-green-700">About Us</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">NEWMAP-EIB Plateau</h1>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
            <div>
              <p>
                The European investment Bank assisted Nigeria Climate Adaptation- Erosion Watershed Project focuses on addressing environmental degradation challenges in Plateau State.
              </p>
              <p className="mt-8">
                With a landscape that is both beautiful and vulnerable, Plateau State has faced significant challenges from severe gully erosion and devastating seasonal flooding. These environmental risks not only threaten infrastructure and agricultural lands but also the very livelihoods of local communities.
              </p>
            </div>
            <div>
              <p>
                Our comprehensive approach goes beyond mere structural interventions. We believe in building climate resilience from the ground up by combining advanced engineering solutions with vegetative land management and active community participation.
              </p>
              <p className="mt-8">
                Our mission is to reduce vulnerability to soil erosion, flooding, and climate-related risks, ensuring a sustainable and secure future for all residents.
              </p>
            </div>
          </div>
          
          <div className="mt-16 sm:mt-24 lg:mt-32">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-10 text-center lg:text-left">Key Focus Areas</h2>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-700">
                    <Leaf className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Watershed Management
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Restoring the natural balance of water flow and land stability.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Droplets className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Flood Mitigation
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Reducing the devastating impacts of urban and rural flooding.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500">
                    <ShieldAlert className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Erosion Control
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Healing the scars of gully erosion through robust engineering.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-900">
                    <Info className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Community Sensitization
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Educating and equipping communities to understand and protect their environment.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
