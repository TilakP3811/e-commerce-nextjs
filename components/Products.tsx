import Link from "next/link";
import { simplifiedProduct } from "@/lib/interface";
import { client } from "@/app/lib/sanity";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToBag from "@/components/AddToBag";

async function getData() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    price,
    name,
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    price_id
  }`;

  const data = await client.fetch(query);

  return data;
}

export const dynamic = "force-dynamic";

export default async function Products() {
  const data: simplifiedProduct[] = await getData();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            All products
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <div key={product._id} className="group relative">
              <Link href={`/product/${product.slug}`}>
                <div className="w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 h-80 md:h-96">
                  <Image
                    src={product.imageUrl}
                    alt="Product image"
                    className="w-full h-full object-cover object-center lg:h-full lg:w-full"
                    width={200}
                    height={500}
                  />
                </div>

                <div className="mt-4 flex justify-between mb-4">
                  <div>
                    <h3 className="text-sm text-gray-700 font-bold">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </Link>
              <AddToBag
                currency="USD"
                description={product.description}
                image={product.imageUrl}
                name={product.name}
                price={product.price}
                key={product._id}
                price_id={product.price_id}
              >
                <Button style={{ width: "100%" }}>Add To Cart</Button>
              </AddToBag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
