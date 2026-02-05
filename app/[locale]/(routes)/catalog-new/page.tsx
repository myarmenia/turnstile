import Banner from '@/app/components/Banner/Banner';
import catalogBanner from '@/public/images/catalogBanner.jpeg';
import CatalogItemNew from '@/app/components/CatalogItem/CatalogItemNew';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Product = {
  id: number;
  code: string;
  image: string;
};

export const metadata: Metadata = {
  title: 'Կատալոգ | Turnstiles Catalog | Каталог Турникетов',
  description: 'Մեր կատալոգում կարող եք գտնել բարձրորակ տուրնիկետներ՝ նախատեսված տարբեր միջավայրերի համար: Անցումների վերահսկման լուծումներ բիզնես կենտրոնների, մարզադահլիճների և պետական հիմնարկների համար: Բարձր որակ, դիմացկունություն և ժամանակակից դիզայն: Արագ առաքում և տեղադրում: Մասնագիտական խորհրդատվություն: Наш каталог предлагает высококачественные турникеты для различных сред. Решения для контроля доступа в бизнес-центры, спортивные залы и государственные учреждения. Высокое качество, долговечность и современный дизайн. Быстрая доставка и установка. Профессиональные консультации. Our catalog features high-quality turnstiles designed for various environments. Access control solutions for business centers, gyms, and government institutions. High quality, durability, and modern design. Fast delivery and installation. Professional consultation. turniket gnel | turniketner vacharq | mutqi hamakarg | տուռնիկետ տուռնիկետների վաճառք | տուռնիկետներ գնել մուտքի համակարգ | անվտանգության համակարգ | турникеты ереван | турникет | купить турникет | продажа турникетов | система безопасности',
  openGraph: {
    title: 'Կատալոգ | Turnstiles Catalog | Каталог Турникетов',
    description: 'Մեր կատալոգում կարող եք գտնել բարձրորակ տուրնիկետներ՝ նախատեսված տարբեր միջավայրերի համար: Անցումների վերահսկման լուծումներ բիզնես կենտրոնների, մարզադահլիճների և պետական հիմնարկների համար: Բարձր որակ, դիմացկունություն և ժամանակակից դիզայն: Արագ առաքում և տեղադրում: Մասնագիտական խորհրդատվություն: Наш каталог предлагает высококачественные турникеты для различных сред. Решения для контроля доступа в бизнес-центры, спортивные залы и государственные учреждения. Высокое качество, долговечность и современный дизайн. Быстрая доставка и установка. Профессиональные консультации. Our catalog features high-quality turnstiles designed for various environments. Access control solutions for business centers, gyms, and government institutions. High quality, durability, and modern design. Fast delivery and installation. Professional consultation. turniket gnel | turniketner vacharq | mutqi hamakarg | տուռնիկետ տուռնիկետների վաճառք | տուռնիկետներ գնել մուտքի համակարգ | անվտանգության համակարգ | турникеты ереван | турникет | купить турникет | продажа турникетов | система безопасности',
    url: "https://turniket.am/catalog",
    siteName: "turniket.am",
    type: "website",
    locale: "am",
    images: [
      {
        url: "/public/images/navlogo.png",
        width: 700,
        height: 650,
        alt: "Կատալոգ | Turnstiles Catalog | Каталог Турникетов"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: 'Կատալոգ | Turnstiles Catalog | Каталог Турникетов',
    description: 'Մեր կատալոգում կարող եք գտնել բարձրորակ տուրնիկետներ՝ նախատեսված տարբեր միջավայրերի համար: Անցումների վերահսկման լուծումներ բիզնես կենտրոնների, մարզադահլիճների և պետական հիմնարկների համար: Բարձր որակ, դիմացկունություն և ժամանակակից դիզայն: Արագ առաքում և տեղադրում: Մասնագիտական խորհրդատվություն: Наш каталог предлагает высококачественные турникеты для различных сред. Решения для контроля доступа в бизнес-центры, спортивные залы и государственные учреждения. Высокое качество, долговечность и современный дизайн. Быстрая доставка и установка. Профессиональные консультации. Our catalog features high-quality turnstiles designed for various environments. Access control solutions for business centers, gyms, and government institutions. High quality, durability, and modern design. Fast delivery and installation. Professional consultation. turniket gnel | turniketner vacharq | mutqi hamakarg | տուռնիկետ տուռնիկետների վաճառք | տուռնիկետներ գնել մուտքի համակարգ | անվտանգության համակարգ | турникеты ереван | турникет | купить турникет | продажа турникетов | система безопасности',
    images: ["/public/images/navlogo.png"]
  },
  alternates: {
    canonical: 'https://turniket.am/',
    languages: {
      'am': 'https://turniket.am/am/catalog',
      'en': 'https://turniket.am/en/catalog',
    },
  },
};

const localeMap: Record<string, string> = {
  am: "hy",
  ru: "ru",
  en: "en",
};


async function getProducts(locale: string): Promise<Product[]> {

  const apiLocale = localeMap[locale] ?? "en";
  console.log(apiLocale, 'loooooooooocal')
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    {
      headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          "Accept-Language": apiLocale,
          Accept: "application/json",
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    console.error('API ERROR:', res.status);
    return [];
  }

  const data = await res.json();
 
  return data.data || [];
}

export default async function CatalogPage({ params }: { params: { locale: string } }){

  const { locale } = params;
  console.log(locale, 88888)
  const t = await getTranslations('');
  const products = await getProducts(locale);

  
  const bannerContent = {
    title: t('TurnstileBanner.title'),
    description: t('TurnstileBanner.content'),
    btn: t('TurnstileBanner.see_more_btn'),
  };

  return (
    <div className="turnstile_page">
      <Banner
        bg={catalogBanner.src}
        content={bannerContent}
        page="catalog"
      />

      <CatalogItemNew products={products} />
    </div>
  );
}
