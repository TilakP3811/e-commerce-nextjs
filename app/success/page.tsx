"use client";

import { CheckCheck } from "lucide-react";

export default function StripeSuccess() {
  return (
    <div className="h-screen">
      <div className="mt-32 md:max-w-[50vw] mx-auto">
        <CheckCheck className="text-green-600 w-16 h-16 mx-auto my-6" />
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for you purchase We hope you enjoy it, you will receive an
            invoice email shortly.
          </p>
          <p>Have a great day!</p>
        </div>
      </div>
    </div>
  );
}
