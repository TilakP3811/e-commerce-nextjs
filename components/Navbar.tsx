"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";

export default function Navbar() {
  const { handleCartClick, cartCount } = useShoppingCart();
  return (
    <header className="mb-8 border-b">
      <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl">
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-bold">
            Aakriti <span className="text-primary">Studio</span>
          </h1>
        </Link>

        <div className="flex divide-x border-r sm:border-l">
          <Button
            variant={"outline"}
            onClick={() => handleCartClick()}
            className="flex flex-col gap-y-1.5 h-12 w-12 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-none"
          >
            <div className="relative inline-block">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-orange-100 bg-orange-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {cartCount}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
