"use client";

import CCAvenue from "@/lib/CCAvenue";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useShoppingCart } from "use-shopping-cart";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { client } from "@/app/lib/sanity";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(4),
  address: z.string().min(3),
  apartment: z.string().optional(),
  country: z.string().min(1),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().min(3),
  phone: z.string().optional(),
});

export const dynamic = "force-dynamic";

export default function Cart() {
  const router = useRouter();
  const [checkedOut, setCheckedOut] = useState(false);
  const { cartCount, cartDetails, removeItem, totalPrice } = useShoppingCart();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      address: "",
      apartment: "",
      country: "",
      city: "",
      state: "",
      pinCode: "",
      phone: "",
    },
  });

  function productQuery(slug: any, quantity: number) {
    return `*[_type == "product" && slug.current == "${slug}"][0] {
      _id,
      "imageUrl": image.asset->url,
      price,
      name,
      description,
      "slug": slug.current,
      "totalPrice": price * ${quantity}
    }`;
  }

  const generateKeyWithDate = () => {
    const currentDate = new Date();
    const timestamp = currentDate
      .toISOString()
      .replace(/[-T:]/g, "")
      .slice(0, -5);
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomString}`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setCheckedOut((value) => !value);

    const products = Object.values(cartDetails ?? {}).map((entry) => {
      return {
        slug: entry.price_id,
        quantity: entry.quantity,
        _key: generateKeyWithDate(),
      };
    });

    try {
      const data = await Promise.all(
        products.map(async (product) => {
          return await client.fetch(
            productQuery(product.slug, product.quantity),
          );
        }),
      );

      const grandTotal = data.reduce(
        (sum, product) => sum + product.totalPrice,
        0,
      );

      const orderDetails = {
        totalPrice: grandTotal,
        email: values.email,
        fullName: values.fullName,
        address: values.address,
        apartment: values.apartment,
        country: values.country,
        city: values.city,
        state: values.state,
        passCode: values.pinCode,
        phone: values.phone,
        status: "payment processing",
        items: products,
      };

      const response = await client.create({
        _type: "order",
        ...orderDetails,
      });

      const paymentData = {
        merchant_id: process.env.NEXT_PUBLIC_MERCHANT_ID,
        order_id: response._id,
        amount: grandTotal,
        currency: process.env.NEXT_PUBLIC_CURRENCY,
        billing_email: values.email,
        billing_name: values.fullName,
        billing_address: values.address,
        billing_city: values.city,
        billing_state: values.state,
        billing_zip: values.pinCode,
        billing_country: values.country,
        redirect_url: `${process.env.NEXT_PUBLIC_URL_HOST}/api/handle_success?order=${response._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL_HOST}/api/handle_cancel?order=${response._id}`,
        language: "EN",
        billing_tel: values.phone,
      };

      const encReq = CCAvenue.getEncryptedOrder(paymentData);

      const URL = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${paymentData.merchant_id}6&encRequest=${encReq}&access_code=${process.env.NEXT_PUBLIC_ACCESS_CODE}`;
      router.push(URL);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-full flex flex-col justify-between">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Cart items
            </h2>
            <div className="flex-1">
              <ul className="-my-6 divide-y divide-gray-200">
                {cartCount === 0 ? (
                  <h1 className="py-6">You dont have any items</h1>
                ) : (
                  <>
                    {Object.values(cartDetails ?? {}).map((entry) => (
                      <li key={entry.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={entry.image as string}
                            alt="Product image"
                            width={100}
                            height={100}
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{entry.name}</h3>
                              <p className="ml-4">${entry.price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {entry.description}
                            </p>
                          </div>

                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">
                              QTY: {entry.quantity}
                            </p>

                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => removeItem(entry.id)}
                                className="font-medium text-primary hover:text-primary/80"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-600">
              Shipping Address
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please provide correct email so we can contact and send
                        you a invoice.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jonathon Clar" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passcode *</FormLabel>
                      <FormControl>
                        <Input placeholder="Passcode" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="9870123456" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal:</p>
                    <p>${totalPrice}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes are calculated at checkout.
                  </p>

                  <div className="mt-6">
                    {cartCount === 0 ? (
                      <Button disabled type="submit" className="w-full">
                        Checkout
                      </Button>
                    ) : checkedOut ? (
                      <Button disabled type="submit" className="w-full">
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    ) : (
                      <Button type="submit" className="w-full">
                        Checkout
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
