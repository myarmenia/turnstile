"use client"
import React from 'react'
import Image from 'next/image'
import { our_partners_data } from '@/utils/partner'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import "swiper/css/navigation";
import { useTranslations } from 'next-intl'


const productCodeToTitleIndex:Record<string,number> = {
  "1":0,
  "2":1,
  "3":2,
  "4":3,
  "5":4,
  "6":5,
  "7":6,
  "8":7,
  "9":8,
  "10":9,
  "11":10
}

const paintingSizes:Record<string,number> = {
    "1":80,
    "2":100,
    "3":100,
    "4":100,
    "5":90,
    "6":100,
    "7":80,
    "8":100,
    "9":80,
    "10":110,
    "11":80
}

const SwiperPartners = () => {
  const t = useTranslations('NameOfPartners')
  const productID = [0,1,2,3,4,5,6,7,8,9,10]
  return (
    <div className='w-full px-4 p-4'>
     <Swiper
            className='mySwiper h-[200px]'
            slidesPerView={7}
            spaceBetween={20}
            modules={[Pagination]}
            pagination={{ clickable: true }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              480: {
                slidesPerView:2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 7,
                spaceBetween: 30,
              },
            }}>
            {our_partners_data.map(product => {
              const sizes = paintingSizes[product.id]
              const titleIndex = productCodeToTitleIndex[product.id]
              const title = productID.includes(titleIndex) && titleIndex !== undefined ?
              t(`${titleIndex}.itemTitle`) : ""
              
              return (
              <SwiperSlide key={product.id} style={{
              display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Image
                    src={product.img[0]}
                    title={title}
                    alt={title}
                    className={`object-cover w-[${sizes}px] h-auto`}
                  />                 
              </SwiperSlide>
            )
            })}
          </Swiper>
    </div>
  )
}

export default SwiperPartners
