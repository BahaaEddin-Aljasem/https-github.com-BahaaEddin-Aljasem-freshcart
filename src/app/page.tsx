import { HeroSection } from "@/features/home/components/HeroSection";
import { CategoriesSection } from "@/features/home/components/CategoriesSection";
import { DealsSection } from "@/features/home/components/DealsSection";
import { FeaturedProductsSection } from "@/features/home/components/FeaturedProductsSection";
import { NewsletterSection } from "@/features/home/components/NewsletterSection";
import { PAGE_SIZE } from "@/config/constants";
import { getCategories, getProducts } from "@/services/catalog.service";

export const revalidate = 300;

export default async function HomePage() {
  const [categories, catalog] = await Promise.all([
    getCategories(),
    getProducts({ pageSize: 50, sort: "rating" }),
  ]);
  const clothingCategoryIds = new Set(
    categories
      .filter((category) => /fashion|clothing|apparel|wear|men|women/i.test(category.name))
      .map((category) => category.id),
  );
  const clothingImages = new Set<string>();
  for (const product of catalog.items) {
    if (
      clothingCategoryIds.has(product.categoryId) ||
      /fashion|clothing|apparel|wear|men|women/i.test(product.categoryName)
    ) {
      if (product.imageUrl) clothingImages.add(product.imageUrl);
    }
  }
  categories
    .filter((category) => clothingCategoryIds.has(category.id) && category.imageUrl)
    .forEach((category) => clothingImages.add(category.imageUrl));

  return (
    <>
      <HeroSection images={[...clothingImages]} />
      <CategoriesSection categories={categories} />
      <DealsSection />
      <FeaturedProductsSection products={catalog.items.slice(0, PAGE_SIZE)} />
      <NewsletterSection />
    </>
  );
}
