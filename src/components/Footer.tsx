import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-white tracking-tight">NEWMAP-EIB</span>
            </Link>
            <p className="text-sm leading-6 text-gray-300">
              Addressing environmental degradation challenges, soil erosion, and flooding in Plateau State. Supported by the European Investment Bank.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Navigation</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/about" className="text-sm leading-6 text-gray-300 hover:text-white">About Us</Link>
                  </li>
                  <li>
                    <Link href="/projects" className="text-sm leading-6 text-gray-300 hover:text-white">Projects</Link>
                  </li>
                  <li>
                    <Link href="/news" className="text-sm leading-6 text-gray-300 hover:text-white">News & Updates</Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="text-sm leading-6 text-gray-300 hover:text-white">Gallery</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <p className="text-sm leading-6 text-gray-300">Plateau State Project Office</p>
                  </li>
                  <li>
                    <a href="mailto:info@newmapeibplateau.org" className="text-sm leading-6 text-gray-300 hover:text-white">info@newmapeibplateau.org</a>
                  </li>
                  <li>
                    <p className="text-sm leading-6 text-gray-300">+234 XXX XXX XXXX</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">&copy; {new Date().getFullYear()} NEWMAP-EIB Plateau. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
