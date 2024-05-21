import Image from "next/image";
import { urlFor } from "@/app/lib/sanity";
import { useState } from "react";

interface iAppProps {
  image: string;
}

export default function ImageGallery({ image }: iAppProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
        <Image
          src={image}
          alt="Photo"
          width={500}
          height={700}
          className="h-full w-full object-cover object-center"
        />

        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
          Sale
        </span>
      </div>
    </div>
  );
}
