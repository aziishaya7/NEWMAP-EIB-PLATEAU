import Link from "next/link";
import { Leaf } from "lucide-react";
import Image from "next/image";

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
              <Image src="/newmaplogo.jpg" width={80} height={50} alt="new map" />
            </Link>
            <p className="text-sm leading-6 text-gray-300">
              Addressing environmental degradation challenges, soil erosion, and flooding in Plateau State. Supported by the European Investment Bank.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
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
                    <p className="text-sm leading-6 text-gray-300">No 11 Wamba Road Tudun Wada GRA JOS Plateau State</p>
                  </li>
                  <li>
                    <a href="mailto:newmapeibjos@gmail.com" className="text-sm leading-6 text-gray-300 hover:text-white">newmapeibjos@gmail.com

                    </a>
                  </li>
                  <li>
                    <p className="text-sm leading-6 text-gray-300">+234 8067461331</p>
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
