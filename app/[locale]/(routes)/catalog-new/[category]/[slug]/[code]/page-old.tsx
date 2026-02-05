// app/[locale]/(routes)/catalog-new/[category]/[slug]/[code]/page.tsx
import React from "react";
import SingleProductSwiper from "@/app/components/SingleProductSwiper/SingleProductSwiper";
import VideoComponent from "@/app/components/VideoComonent/VideoComonent";
import ButtonComponent from "@/app/components/ButtonComponent/ButtonComponent";
import SimilarProductsSwiper from "@/app/components/SimilarProductsSwiper/SimilarProductsSwiper";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface ProductAPIResponse {
    id: number;
    slug: string;
    name: string;
    description: string;
    specifications?: string;
    code: string;
    category_slug: string;
    main_image: string | null;
    slider_images: string[];
    additional_files: string[];
    videos: string[];
    documents: string[];
}

const localeMap: Record<string, string> = {
    am: "hy",
    ru: "ru",
    en: "en",
};

/* =======================
   SEO METADATA
======================= */
export async function generateMetadata({
    params,
}: {
    params: { locale: string; code: string };
}): Promise<Metadata> {
    const { locale, code } = params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiLocale = localeMap[locale] ?? "en";

    const res = await fetch(`${apiUrl}/api/products/param/${code}`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            "Accept-Language": apiLocale,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        return {
            title: "Product not found",
            description: "Product not found",
        };
    }

    const { data: product }: { data: ProductAPIResponse } = await res.json();

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            url: `${apiUrl}/${locale}/catalog-new/${product.category_slug}/${product.slug}/${product.code}`,
            siteName: "turniket.am",
            type: "website",
            images: product.main_image
                ? [
                    {
                        url: product.main_image,
                        width: 700,
                        height: 650,
                        alt: product.name,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
            images: product.main_image ? [product.main_image] : [],
        },
    };
}

/* =======================
   PAGE
======================= */
interface PageProps {
    params: {
        locale: string;
        category: string;
        slug: string;
        code: string;
    };
}

const SingleProductPage = async ({ params }: PageProps) => {
    const { locale, code } = params;
    const apiLocale = localeMap[locale] ?? "en";

    const t = await getTranslations({
        locale,
        namespace: "OurProductsSection",
    });

    const tTitles = await getTranslations({
        locale,
        namespace: "singleProductPageTitles",
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/api/products/param/${code}`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            "Accept-Language": apiLocale,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        return (
            <div className="container py-10 text-center text-red-500">
                Product not found
            </div>
        );
    }

    const { data: product }: { data: ProductAPIResponse } = await res.json();

    const sliderImages = [
        ...product.slider_images,
    ].filter(Boolean) as string[];

    const productUrl = `/catalog-new/${product.category_slug}/${product.slug}/${product.code}`;

    return (
        <div className="one_product_page container py-6 px-4 flex flex-col gap-10">

            {/* ===== MAIN IMAGE + INFO ===== */}
            <div className="flex max-md:flex-col justify-center gap-10 items-start">

                {/* LEFT: MAIN IMAGE */}
                <div className="w-[45%] max-md:w-full flex flex-col gap-4">
                    {product.main_image && (
                        <img
                            src={product.main_image}
                            alt={product.name}
                            className="w-full rounded-md object-cover"
                        />
                    )}

                    {/* SLIDER BELOW MAIN IMAGE */}
                    {sliderImages.length > 0 && (
                        <SingleProductSwiper images={sliderImages} />
                    )}
                </div>

                {/* RIGHT: INFO */}
                <div className="w-[45%] max-md:w-full flex flex-col gap-5">
                    <h1 className="arm_Hmks_Bebas_Neue font-semibold text-[30px] leading-[37.6px] font_color uppercase">
                        {product.name}
                    </h1>

                    <p className="arm_Hmks_Bebas_Neue font-medium text-[16px] font_color"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    >                      
                    </p>                   


                    {/* SPECIFICATIONS */}
                    {product.specifications && (
                        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line mt-2"
                            dangerouslySetInnerHTML={{ __html: product.specifications }}>
                            
                        </div>
                    )}

                    {/* ADDITIONAL FILES */}
                    {product.additional_files.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Additional Files</h3>
                            <ul className="flex flex-col gap-1">
                                {product.additional_files.map((file, i) => (
                                    <li key={i}>
                                        <a
                                            href={file}
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            File {i + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* DOCUMENTS */}
                    {product.documents.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Documents</h3>
                            <ul className="flex flex-col gap-1">
                                {product.documents.map((doc, i) => (
                                    <li key={i}>
                                        <a
                                            href={doc}
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            Document {i + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ORDER BUTTON */}
                    <div className="mt-6">
                        <ButtonComponent
                            name={t("order_btn")}
                            bg="#5939F5"
                            color="#fff"
                            size="14px"
                            border="none"
                            width="300px"
                            py="10px"
                            px="0"
                            order={product.code}
                            href={productUrl}
                        />
                    </div>
                </div>
            </div>

            {/* VIDEOS */}
            {product.videos.length > 0 && (
                <div className="w-full flex flex-wrap justify-center gap-5 mt-10">
                    {product.videos.map((video, i) => (
                        <div key={i} className="w-full md:w-[18%] h-[400px]">
                            <VideoComponent path={video} thumb="" />
                        </div>
                    ))}
                </div>
            )}

            {/* SIMILAR PRODUCTS */}
            <div className="w-full mt-10">
                <h2 className="text-2xl font-bold mb-6 text-blue-900">
                    {tTitles("1")}
                </h2>
                <SimilarProductsSwiper />
            </div>
        </div>
    );
};

export default SingleProductPage;
