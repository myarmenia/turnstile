"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { SwiperSlide, Swiper } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { our_products_data } from '@/utils/catalog';
import { useTranslations } from 'next-intl';
import "swiper/css";
import "swiper/css/navigation";

const productCodeToTitleIndex: Record<string, number> = {
  "PZ-sanitaric-64": 0,
  "PZ-hygiene-66": 1,
  "PZ-26": 2,
  "TM-22": 3,
  "TV-1": 4,
  "PZ-3": 5,
  "TM-11": 6,
  "PZ-21": 7,
  "PZ-20": 8,
  "PZ-4": 9,
  "PZ-6": 10,
};

const SimilarProductsSwiper = () => {

    const [lang, setLang] = useState('am');

    useEffect(() => {
        const cookieLang = document.cookie
            .split('; ')
            .find(row => row.startsWith('lang='))
            ?.split('=')[1] || 'am';
        setLang(cookieLang);
    }, []);
    const t = useTranslations();
    const productCodes = ['PZ-3', 'PZ-4', 'PZ-21', 'PZ-6', 'PZ-20', "TV-1", 
    'PZ-26', 'TM-11', 'TM-22', 'PZ-sanitaric-64', 'PZ-hygiene-66']
    
    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={30}
            navigation={true}
            modules={[Navigation, Autoplay]}
            loop
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            breakpoints={{
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1280: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
            }}
            className="mySwiper"
        >
            {our_products_data.map(product => {
                const titleIndex = productCodeToTitleIndex[product.code];
                const title = productCodes.includes(product.code) && titleIndex !== undefined
                ? t(`titleInfoProducts.${titleIndex}.itemTitle`) : "";
                return (
                    <SwiperSlide key={product.id}>
                    <Link href={`/${lang}/catalog/${product.code}`} className="flex flex-col items-center"
                        title={title}>
                        <Image
                            src={product.img[0]}
                            title={title}
                            alt={product.id}
                            className="object-cover h-[250px]"
                        />
                        <p className="text-lg mt-2 font-semibold">{product.code}</p>
                    </Link>
                </SwiperSlide>
                )
            })}
        </Swiper>
    )
}

export default SimilarProductsSwiper
