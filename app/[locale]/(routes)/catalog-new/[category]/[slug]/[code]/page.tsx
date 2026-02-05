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
import ClientSlugUpdater from '@/app/components/Slug/ClientSlugUpdater';
import { FaPhone, FaCheckCircle } from 'react-icons/fa';

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

    const tProduct = await getTranslations({
        locale,
        namespace: "ProductPage",
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

    const productUrl = `/catalog-new/${product.category_slug}/${product.slug}/${product.code}`;
    const currentPath = `/${locale}/catalog-new/${params.category}/${params.slug}/${params.code}`;

    // Телефоны для разных языков
    const phoneNumbers = {
        ru: ['+374 96-10-10-17', '+374 96-40-00-73'],
        en: ['+374 96-10-10-17', '+374 96-40-00-73'],
        hy: ['+374 96-10-10-17', '+374 96-40-00-73']
    };

    // Форматирование номера телефона для ссылки
    const formatPhoneForLink = (phone: string): string => {
        return phone.replace(/[^0-9+]/g, '');
    };

    // Извлечение преимуществ из описания
    const extractAdvantages = (html: string): string[] => {
        const text = html.replace(/<[^>]*>/g, '');
        const lines = text.split('\n')
            .filter(line => line.trim().length > 0 && line.trim().length < 200);

        // Если мало строк, создаем преимущества из первых предложений
        if (lines.length < 2) {
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
            return sentences.slice(0, 4);
        }

        return lines.slice(0, 4);
    };

    const advantages = extractAdvantages(product.description);

    // Подготовка данных для табов
    const tabsData = {
        description: product.description,
        specifications: product.specifications,
        gallery: sliderImages,
        videos: videoItems,
        documents: [...documentItems, ...additionalFileItems],
        delivery: null,
    };

    return (
        <div className="one_product_page container py-6 px-4 flex flex-col gap-10">
            {/* ===== MAIN IMAGE + INFO ===== */}
            <div className="flex max-md:flex-col justify-between gap-10 items-stretch min-h-[600px] max-md:min-h-0">

                {/* LEFT: IMAGE SECTION WITH SLIDER */}
                <div className="w-[48%] max-md:w-full flex flex-col">
                    {/* Слайдер под главной картинкой */}
                    {sliderImages.length > 0 ? (
                        <div className="flex-1">
                            <NewSingleProductSwiper
                                images={sliderImages.map(img => ({
                                    src: img.url,
                                    alt: img.alt || `${product.name} - ${tProduct('image')}`,
                                    title: img.title || product.name
                                }))}
                                productName={product.name}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-sm text-center">
                                {tProduct('noSliderImages')}
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT: PRODUCT INFO */}
                <div className="w-[48%] max-md:w-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
                        {/* Заголовок */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase mb-4">
                            {product.code}  {product.name}
                        </h1>

                        {/* Основные преимущества */}
                        <div className="mb-6 flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FaCheckCircle className="text-green-500" />
                                {tProduct('mainAdvantages')}
                            </h3>

                            {advantages.length > 0 ? (
                                <ul className="space-y-2">
                                    {advantages.map((advantage, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-gray-700 text-sm">{advantage}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div
                                        className="text-gray-700 text-sm"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Категория и Код товара */}
                        <div className="mb-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-2 rounded">
                                    <span className="text-gray-500 block mb-1 text-xs">
                                        {tProduct('category')}
                                    </span>
                                    <span className="font-medium text-gray-800 text-sm">
                                        {product.category_name}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-2 rounded">
                                    <span className="text-gray-500 block mb-1 text-xs">
                                        {tProduct('productCode')}
                                    </span>
                                    <span className="font-medium text-gray-800 text-sm">
                                        {product.code}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Компактный блок контактов */}
                        <div className="mb-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                                        <FaPhone className="text-blue-600 text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            {tProduct('contactForPurchase')}
                                        </h4>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {phoneNumbers[apiLocale as keyof typeof phoneNumbers]?.map((phone, index) => (
                                        <a
                                            key={index}
                                            href={`tel:${formatPhoneForLink(phone)}`}
                                            className="flex items-center gap-2 p-2 bg-white rounded hover:bg-blue-50 transition-colors group"
                                        >
                                            <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                                                <FaPhone className="text-green-600 text-xs" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-800">
                                                {phone}
                                            </span>
                                            <span className="ml-auto text-blue-600 text-xs font-medium group-hover:text-blue-800">
                                                {tProduct('call')}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Кнопка заказа */}
                        <div className="pt-4 border-t border-gray-100">
                            <ButtonComponent
                                name={t("order_btn")}
                                bg="#5939F5"
                                color="#fff"
                                size="14px"
                                border="none"
                                width="100%"
                                py="10px"
                                px="0"
                                order={product.code}
                                href={productUrl}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ТАБЫ */}
            <div className="mt-8">
                <ProductTabs
                    data={tabsData}
                    productName={product.name}
                />
            </div>

            {/* ПОХОЖИЕ ТОВАРЫ */}
            <div className="mt-10 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    {tTitles("1")}
                </h2>
                <SimilarProductsSwiper />
            </div>

            <ClientSlugUpdater
                currentPath={currentPath}
                correctPath={`/${locale}${productUrl}`}
            />
        </div>
    );
};

export default SingleProductPage;























// // app/[locale]/(routes)/catalog-new/[category]/[slug]/[code]/page.tsx
// import React from "react";
// import NewSingleProductSwiper from "@/app/components/SingleProductSwiper/NewSingleProductSwiper";
// import ButtonComponent from "@/app/components/ButtonComponent/ButtonComponent";
// import SimilarProductsSwiper from "@/app/components/SimilarProductsSwiper/SimilarProductsSwiper";
// import { getTranslations } from "next-intl/server";
// import { Metadata } from "next";
// import Image from 'next/image';
// import ProductTabs from "@/app/components/ProductTabs/ProductTabs";

// interface MediaItem {
//     url: string;
//     title?: string;
//     alt?: string;
//     type: string;
// }

// interface ProductAPIResponse {
//     id: number;
//     slug: string;
//     name: string;
//     description: string;
//     specifications?: string;
//     code: string;
//     category_slug: string;
//     category_name: string;
//     main_image: MediaItem | null;
//     slider_images: MediaItem[];
//     additional_files: MediaItem[];
//     videos: MediaItem[];
//     documents: MediaItem[];
// }

// const localeMap: Record<string, string> = {
//     am: "hy",
//     ru: "ru",
//     en: "en",
// };

// /* =======================
//    SEO METADATA
// ======================= */
// export async function generateMetadata({
//     params,
// }: {
//     params: { locale: string; code: string };
// }): Promise<Metadata> {
//     const { locale, code } = params;
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//     const apiLocale = localeMap[locale] ?? "en";

//     const res = await fetch(`${apiUrl}/api/products/param/${code}`, {
//         headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
//             "Accept-Language": apiLocale,
//             Accept: "application/json",
//         },
//     });

//     if (!res.ok) {
//         return {
//             title: "Product not found",
//             description: "Product not found",
//         };
//     }

//     const { data: product }: { data: ProductAPIResponse } = await res.json();

//     const mainImageUrl = product.main_image?.url || "";

//     return {
//         title: product.name,
//         description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
//         openGraph: {
//             title: product.name,
//             description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
//             url: `${apiUrl}/${locale}/catalog-new/${product.category_slug}/${product.slug}/${product.code}`,
//             siteName: "turniket.am",
//             type: "website",
//             images: mainImageUrl
//                 ? [
//                     {
//                         url: mainImageUrl,
//                         width: 700,
//                         height: 650,
//                         alt: product.name,
//                     },
//                 ]
//                 : [],
//         },
//         twitter: {
//             card: "summary_large_image",
//             title: product.name,
//             description: product.description.replace(/<[^>]*>/g, '').slice(0, 160),
//             images: mainImageUrl ? [mainImageUrl] : [],
//         },
//     };
// }

// /* =======================
//    PAGE
// ======================= */
// interface PageProps {
//     params: {
//         locale: string;
//         category: string;
//         slug: string;
//         code: string;
//     };
// }

// const SingleProductPage = async ({ params }: PageProps) => {
//     const { locale, code } = params;
//     const apiLocale = localeMap[locale] ?? "en";

//     // Переводы
//     const t = await getTranslations({ locale, namespace: "OurProductsSection" });
//     const tTitles = await getTranslations({ locale, namespace: "singleProductPageTitles" });

//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//     const res = await fetch(`${apiUrl}/api/products/param/${code}`, {
//         headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
//             "Accept-Language": apiLocale,
//             Accept: "application/json",
//         },
//     });

//     if (!res.ok) {
//         return (
//             <div className="container py-10 text-center text-red-500">
//                 Product not found
//             </div>
//         );
//     }

//     const { data: product }: { data: ProductAPIResponse } = await res.json();

//     // Подготовка данных для слайдера и табов
//     const allMediaItems: MediaItem[] = [
//         ...(product.main_image ? [product.main_image] : []),
//         ...product.slider_images,
//     ];

//     const sliderImages = allMediaItems.filter(item => item.type === 'image');
//     const videoItems = product.videos;
//     const documentItems = product.documents;
//     const additionalFileItems = product.additional_files;

//     const productUrl = `/catalog-new/${product.category_slug}/${product.slug}/${product.code}`;

//     // Данные для табов
//     const tabsData = {
//         description: product.description,
//         specifications: product.specifications,
//         gallery: sliderImages,
//         videos: videoItems,
//         documents: [...documentItems, ...additionalFileItems],
//         delivery: null,
//     };

//     return (
//         <div className="one_product_page container py-6 px-4 flex flex-col gap-10">

//             {/* ===== MAIN IMAGE + INFO ===== */}
//             <div className="flex max-md:flex-col justify-between gap-10 items-start">

//                 {/* LEFT: IMAGE SECTION WITH SLIDER */}
//                 <div className="w-[48%] max-md:w-full">
//                     {product.main_image?.url && (
//                         <div className="mb-4">
//                             <Image
//                                 src={product.main_image.url}
//                                 alt={product.main_image.alt || product.name}
//                                 title={product.main_image.title || product.name}
//                                 width={600}
//                                 height={400}
//                                 className="w-full h-auto rounded-md object-cover"
//                             />
//                         </div>
//                     )}

//                     {sliderImages.length > 0 ? (
//                         <div className="mt-6">
//                             <div className="mb-2 text-sm text-gray-500">
//                                 Количество изображений в слайдере: {sliderImages.length}
//                             </div>
//                             <NewSingleProductSwiper images={sliderImages.map(img => img.url)} />
//                         </div>
//                     ) : (
//                         <div className="mt-6 text-gray-500 text-sm">
//                             Нет дополнительных изображений для слайдера
//                         </div>
//                     )}
//                 </div>

//                 {/* RIGHT: PRODUCT INFO */}
//                 <div className="w-[48%] max-md:w-full flex flex-col gap-6">
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
//                         {product.code}  {product.name}
//                     </h1>

//                     <div className="flex items-center gap-2">
//                         <span className="text-gray-600 font-medium">Артикул:</span>
//                         <span className="text-gray-900 font-semibold">{product.code}</span>
//                     </div>

//                     <div className="mt-6">
//                         <ButtonComponent
//                             name={t("order_btn")}
//                             bg="#5939F5"
//                             color="#fff"
//                             size="16px"
//                             border="none"
//                             width="100%"
//                             py="12px"
//                             px="0"
//                             order={product.code}
//                             href={productUrl}
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* ТАБЫ */}
//             <div className="mt-8">
//                 <ProductTabs data={tabsData} locale={locale} />
//             </div>

//             {/* ПОХОЖИЕ ТОВАРЫ */}
//             <div className="mt-10 pt-8 border-t border-gray-200">
//                 <h2 className="text-2xl font-bold mb-6 text-gray-900">
//                     {tTitles("1")}
//                 </h2>
//                 <SimilarProductsSwiper />
//             </div>

//         </div>
//     );
// };

// export default SingleProductPage;
