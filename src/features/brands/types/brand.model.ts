export interface Brand {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ApiBrand {
  _id: string;
  name: string;
  image: string;
}

export function mapBrand(brand: ApiBrand): Brand {
  return { id: brand._id, name: brand.name, imageUrl: brand.image };
}
