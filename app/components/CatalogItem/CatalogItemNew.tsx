'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { filterProps } from 'framer-motion';

type Product = {
  id: number;
  code: string;
  slug: string;
  category_slug: string;
  image: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};


export default function CatalogItemNew({
  products,
  categories
}: {
    products: Product[];
    categories: Category[];
}) {
  const t = useTranslations('');
  const router = useRouter();
  const [lang, setLang] = useState('am');
  const [code, setCode] = useState('');
  const [category_id, setCategory] = useState('');

  useEffect(() => {
    const cookieLang =
      document.cookie
        .split('; ')
        .find(row => row.startsWith('lang='))
        ?.split('=')[1] || 'am';

    setLang(cookieLang);
  }, []);

  const applyFilter = () => {
    const query = new URLSearchParams();

    if (code) query.append('code', code);
    if (category_id) query.append('category_id', category_id);

    router.push(`/${lang}/catalog-new?${query.toString()}`);
  };

  return (
    <div className="container pb-6 flex flex-col gap-7 items-end">


      <div className="flex gap-4 w-full justify-end mb-6">

        <input
          type="text"
          placeholder={t('filter.searchText')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded w-[360px]"
        />

        <select
          value={category_id}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded  w-[360px]"
        >
          <option value="">{t('filter.allCategories')}</option>

          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}

        </select>

        <button
          onClick={applyFilter}
          className="bg-[#5939F5] text-white px-4 rounded"
        >
          {t('filter.buttonFilter')}
        </button>

      </div>

      
      
      
      
      <div className="flex flex-wrap justify-center gap-[20px]">
        {products.map(item => (
          <div
            key={item.id}
            className="w-[280px] flex flex-col items-center gap-[10px] bg-white rounded border-gray-100 border-2 cursor-pointer"
          >
            {/* IMAGE */}
            <div
              className="w-full h-[233px] shadow-sm rounded relative overflow-hidden"
              onClick={() =>
                router.push(`/${lang}/catalog-new/${item.category_slug}/${item.slug}/${item.code}`)
              }
              title={item.code}
            >
              <Image
                src={item.image}
                alt={item.code}
                fill
                className="w-full h-full object-cover rounded absolute top-0 left-0 transition-opacity duration-1000 opacity-100 z-10"
              />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col items-center gap-[10px] w-full justify-center p-[20px]">
              <h3 className="freeSans font_color font-normal text-[16px] leading-[19.2px] text-center">
                {item.code}
              </h3>

              <ButtonComponent
                name={t('OurProductsSection.order_btn')}
                bg="transparent"
                color="#5939F5"
                size="14px"
                border="1px solid #5939F5"
                width="100%"
                py="9px"
                px="0"
                order={item.code}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
