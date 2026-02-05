// app/[locale]/(routes)/catalog-new/[category]/[slug]/[code]/page.tsx
import React from "react";
import SingleProductSwiper from "@/app/components/SingleProductSwiper/SingleProductSwiper";
import NewSingleProductSwiper from "@/app/components/SingleProductSwiper/NewSingleProductSwiper";

import VideoComponent from "@/app/components/VideoComonent/VideoComonent";
import ButtonComponent from "@/app/components/ButtonComponent/ButtonComponent";
import SimilarProductsSwiper from "@/app/components/SimilarProductsSwiper/SimilarProductsSwiper";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Image from 'next/image'
import ProductTabs from "@/app/components/ProductTabs/ProductTabs";
import dynamic from 'next/dynamic';
// import { redirect } from 'next/navigation';
// import { useRouter } from 'next/navigation';

// const ClientSlugUpdater = dynamic(
//     () => import('@/app/components/Slug/ClientSlugUpdater'),
   
// );

interface MediaItem {
    url: string;
    title?: string;
    alt?: string;
    type: string;
}

interface ProductAPIResponse {
    id: number;
    slug: string;
    name: string;
    description: string;
    specifications?: string;
    code: string;
    category_slug: string;
    category_name: string;
    main_image: MediaItem | null;
    slider_images: MediaItem[];
    additional_files: MediaItem[];
    videos: MediaItem[];
    documents: MediaItem[];
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
        // cache: "no-store",
    });

    if (!res.ok) {
        return {
            title: "Product not found",
            description: "Product not found",
        };
    }

    const { data: product }: { data: ProductAPIResponse } = await res.json();

    const mainImageUrl = product.main_image?.url || "";
    console.log(111111, mainImageUrl)
    return {
        title: product.name,
        description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
            url: `${apiUrl}/${locale}/catalog-new/${product.category_slug}/${product.slug}/${product.code}`,
            siteName: "turniket.am",
            type: "website",
            images: mainImageUrl
                ? [
                    {
                        url: mainImageUrl,
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
            description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
            images: mainImageUrl ? [mainImageUrl] : [],
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
        // cache: "no-store",
    });

    if (!res.ok) {
        return (
            <div className="container py-10 text-center text-red-500">
                Product not found
            </div>
        );
    }

    const { data: product }: { data: ProductAPIResponse } = await res.json();

    // Подготовка данных для слайдера и табов
    const allMediaItems: MediaItem[] = [
        ...(product.main_image ? [product.main_image] : []),
        ...product.slider_images,
    ];

    // Для слайдера используем все изображения
    const sliderImages = allMediaItems.filter(item => item.type === 'image');
    const mainImageUrl = product.main_image?.url || "";
    const videoItems = product.videos;
    const documentItems = product.documents;
    const additionalFileItems = product.additional_files;
    // const router = useRouter();

    console.log(2222, sliderImages.length);

    const productUrl = `/catalog-new/${product.category_slug}/${product.slug}/${product.code}`;
    console.log(productUrl, 55555)

    // if (product && product.slug !== params.slug) {
    //     redirect(`/${locale}${productUrl}`);
    // }
    // router.push(`/${locale}${productUrl}`);
    // redirect(`/${locale}${productUrl}`);
    // router.push(`/${locale}/catalog-new/`)
    const advantages = [
        "Электронная система управления для работы на спортивных площадках",
        "Комплект нержавеющих плашек для защиты от коррозии",
        "Компактный размер — минимальная занимаемая площадь",
        "Автоматическое управление створками"
    ];

    // Подготовка данных для табов
    const tabsData = {
        description: product.description,
        specifications: product.specifications,
        gallery: sliderImages,
        videos: videoItems,
        documents: [...documentItems, ...additionalFileItems],
        delivery: null, // Здесь можно добавить информацию о доставке
    };

    return (
        <div className="one_product_page container py-6 px-4 flex flex-col gap-10">

            {/* ===== MAIN IMAGE + INFO ===== */}
            <div className="flex max-md:flex-col justify-between gap-10 items-start">

                {/* LEFT: IMAGE SECTION WITH SLIDER */}
                <div className="w-[48%] max-md:w-full">
                    {/* Главное изображение */}
                    {/* {mainImageUrl && (
                        <div className="mb-4">
                            <img
                                src={mainImageUrl}
                                alt={product.main_image?.alt || product.name}
                                title={product.main_image?.title}
                                className="w-full h-auto rounded-md object-cover"
                            />
                        </div>
                    )} */}

                    {/* Слайдер под главной картинкой */}
                    {sliderImages.length > 0 ? (
                        <div className="mt-6">
                            <div className="mb-2 text-sm text-gray-500">
                                Количество изображений в слайдере: {sliderImages.length}
                            </div>
                            <NewSingleProductSwiper images={sliderImages.map(img => img.url)} />
                        </div>
                    ) : (
                        <div className="mt-6 text-gray-500 text-sm">
                            Нет дополнительных изображений для слайдера
                        </div>
                    )}
                </div>

                {/* RIGHT: PRODUCT INFO */}
                <div className="w-[48%] max-md:w-full flex flex-col gap-6">
                    {/* Название товара */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
                        {product.code}  {product.name}
                    </h1>

                    {/* Артикул */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium">Артикул:</span>
                        <span className="text-gray-900 font-semibold">{product.code}</span>
                    </div>

                    {/* Цена и наличие */}
                   

                    {/* Счетчик и кнопка в корзину */}
                    

                    {/* Основные преимущества */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Основные преимущества
                        </h3>
                        <div className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                        {/* <ul className="space-y-3">
                            {advantages.map((advantage, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-gray-700">{advantage}</span>
                                </li>
                            ))}
                        </ul> */}
                    </div>

                    {/* Категория и Производитель */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-600 block mb-1">Категория</span>
                                <span className="font-medium capitalize">{product.category_name}</span>
                            </div>                         
                            
                            <div>
                                <span className="text-gray-600 block mb-1">Код товара</span>
                                <span className="font-medium">{product.code}</span>
                            </div>
                        </div>
                    </div>

                    {/* Контактная информация */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-gray-600 mb-1">Пн-Пт: 9:00 до 19:00</div>
                        <div className="text-lg font-semibold text-gray-900">8 (800) 100-33-3</div>
                    </div>

                    {/* Кнопка заказа */}
                    <div className="mt-6">
                        <ButtonComponent
                            name={t("order_btn")}
                            bg="#5939F5"
                            color="#fff"
                            size="16px"
                            border="none"
                            width="100%"
                            py="12px"
                            px="0"
                            order={product.code}
                            href={productUrl}
                        />
                    </div>
                </div>
            </div>

            {/* ТАБЫ */}
            <div className="mt-8">
                <ProductTabs
                    data={tabsData}
                    locale={locale}
                />
            </div>

            {/* ПОХОЖИЕ ТОВАРЫ */}
            <div className="mt-10 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    {tTitles("1")}
                </h2>
                <SimilarProductsSwiper />
            </div>


            
        </div>
    );
};

export default SingleProductPage;