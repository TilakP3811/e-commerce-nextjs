"use client";

import { Button } from "@/components/ui/button";
import { useShoppingCart } from "use-shopping-cart";
import { urlFor } from "@/app/lib/sanity";

export interface ProductCart {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: any;
  price_id: string;
  children?: React.ReactNode;
}

export default function AddToBag({
  currency,
  description,
  image,
  name,
  price,
  price_id,
  children,
}: ProductCart) {
  const { addItem, handleCartClick } = useShoppingCart();

  const product = {
    name: name,
    description: description,
    price: price,
    currency: currency,
    image: urlFor(image).url(),
    price_id: price_id,
  };

  return (
    <div
      onClick={() => {
        addItem(product);
      }}
    >
      {children}
    </div>
  );
}
