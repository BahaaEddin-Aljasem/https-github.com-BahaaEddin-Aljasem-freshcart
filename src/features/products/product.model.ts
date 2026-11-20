export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  subcategoryName?: string;
  brandName?: string;
  quantity: number;
  sold?: number;
  ratingAverage: number;
  ratingCount: number;
  price: number;
  originalPrice?: number;
  createdAt?: string;
}

export interface ApiCategory {
  _id: string;
  name: string;
  image: string;
}

interface ApiSubcategory {
  _id: string;
  name: string;
}

export interface ApiProduct {
  _id: string;
  title: string;
  description?: string;
  imageCover: string;
  images?: string[];
  category?: ApiCategory;
  subcategory?: ApiSubcategory[];
  brand?: { name: string };
  quantity?: number;
  sold?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price: number;
  priceAfterDiscount?: number;
  createdAt?: string;
}

export function mapProduct(product: ApiProduct): Product {
  const discountedPrice = product.priceAfterDiscount;
  const hasDiscount = typeof discountedPrice === "number" && discountedPrice > 0 && discountedPrice < product.price;
  const sold = typeof product.sold === "number" && Number.isSafeInteger(product.sold) && product.sold >= 0
    ? product.sold
    : undefined;

  return {
    id: product._id,
    title: product.title,
    description: product.description ?? "",
    imageUrl: product.imageCover,
    images: product.images?.length ? product.images : [product.imageCover],
    categoryId: product.category?._id ?? "",
    categoryName: product.category?.name ?? "",
    subcategoryName: product.subcategory?.[0]?.name,
    brandName: product.brand?.name,
    quantity: product.quantity ?? 0,
    sold,
    ratingAverage: product.ratingsAverage ?? 0,
    ratingCount: product.ratingsQuantity ?? 0,
    price: hasDiscount ? discountedPrice : product.price,
    originalPrice: hasDiscount ? product.price : undefined,
    createdAt: product.createdAt,
  };
}

export function mapCategory(category: ApiCategory): Category {
  return { id: category._id, name: category.name, imageUrl: category.image };
}
