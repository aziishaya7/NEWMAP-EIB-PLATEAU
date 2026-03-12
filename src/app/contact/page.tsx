import { Building2, Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            We&apos;re here to answer any questions about our projects and initiatives across Plateau State.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="rounded-2xl bg-gray-50 p-6 sm:p-10 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Get in touch</h3>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Reach out to our project office regarding any environmental concerns or inquiries about our intervention areas.
            </p>
            <dl className="mt-8 space-y-6 text-base leading-7 text-gray-600">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <Building2 className="h-7 w-6 text-green-700" aria-hidden="true" />
                </dt>
                <dd>
                  <p className="font-semibold text-gray-900">Plateau State Project Office</p>
                  Jos, Plateau State<br />
                  Nigeria
                </dd>
              </div>
              <div className="flex gap-x-4 mt-6">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <Phone className="h-7 w-6 text-green-700" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-green-700 hover:underline" href="tel:+234XXXXXXXXX">
                    +234 XXX XXX XXXX
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4 mt-6">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <Mail className="h-7 w-6 text-green-700" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-green-700 hover:underline" href="mailto:info@newmapeibplateau.org">
                    info@newmapeibplateau.org
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Contact Form */}
          <form action="#" method="POST" className="px-6 pb-24 pt-10 sm:pb-32 lg:px-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                    Full name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-green-700 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 w-full sm:w-auto transition"
                >
                  Send message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
