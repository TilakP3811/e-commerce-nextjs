import AddToBag from "@/components/AddToBag";
import { fullProduct } from "@/lib/interface";
import { client } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import ImageGallery from "@/components/ImageGallery";
import RandomProducts from "@/components/RandomProducts";

async function getData(slug: string) {
  const query = `*[_type == "product" && slug.current == "${slug}"][0] {
    _id,
    "imageUrl": image.asset->url,
    price,
    name,
    description,
    "slug": slug.current,
    price_id
  }`;

  const data = await client.fetch(query);

  return data;
}

export const dynamic = "force-dynamic";

export default async function ProductPge({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullProduct = await getData(params.slug);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGallery image={data.imageUrl} />

          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                {data.name}
              </h2>
            </div>

            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-600 md:text-2xl">
                  ${data.price}
                </span>
              </div>
            </div>

            <p className="mt-8 text-base text-gray-500 tracking-wide">
              {data.description}
            </p>

            <div className="flex gap-2.5 my-6">
              <AddToBag
                currency="USD"
                description={data.description}
                image={data.imageUrl}
                name={data.name}
                price={data.price}
                key={data._id}
                price_id={data.price_id}
              >
                <Button style={{ width: "100%" }}>Add To Cart</Button>
              </AddToBag>
            </div>
          </div>
        </div>
        <RandomProducts />
      </div>
    </div>
  );
}
