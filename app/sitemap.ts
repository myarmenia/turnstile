import { MetadataRoute } from "next"
import { our_products_data } from "@/utils/catalog"

const BASE_URL = "https://turniket.am"
const LOCALES = ["am", "ru", "en"]

// Статические страницы сайта
const STATIC_PAGES = ["", "turnstile", "security-systems", "catalog", "crm-system"]

export default function sitemap(): MetadataRoute.Sitemap {
    const pages: MetadataRoute.Sitemap = []

    // Статические страницы с hreflang
    for (const locale of LOCALES) {
        for (const page of STATIC_PAGES) {
            const url = `${BASE_URL}/${locale}${page ? "/" + page : ""}`
            pages.push({
                url,
                lastModified: new Date(),
                changeFrequency: "monthly",
                priority: page === "" ? 1 : 0.8,
                alternates: LOCALES.map((alt) => ({
                    hrefLang: alt,
                    url: `${BASE_URL}/${alt}${page ? "/" + page : ""}`,
                })),
            })
        }
    }

    // Продукты (без alternates, чтобы не падала память)
    for (const product of our_products_data) {
        for (const locale of LOCALES) {
            pages.push({
                url: `${BASE_URL}/${locale}/catalog/${product.code}`,
                lastModified: new Date(), // или product.updated_at, если есть
                changeFrequency: "weekly",
                priority: 0.9,
            })
        }
    }

    return pages
}
