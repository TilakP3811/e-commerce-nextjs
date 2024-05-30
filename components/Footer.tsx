"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="rounded-lg shadow bg-gray-900 m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Aakriti <span className="text-primary">Studio</span>
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 text-gray-400">
            <li>
              <Link
                href="/terms_and_conditions"
                className="hover:underline me-4 md:me-6"
              >
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy_policy"
                className="hover:underline me-4 md:me-6"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        <span className="block text-sm sm:text-center text-gray-400">
          © 2024{" "}
          <Link href="/" className="hover:underline">
            Aakriti Studio™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
