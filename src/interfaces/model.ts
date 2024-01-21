export interface ProductRes {
  id: number;
  name: string;
  image?: string;
  price: {
    priceMin: number;
    priceMax: number;
  };
}
export interface Category {
  id: number;
  name: string;
  level: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  category: Category;
  product_model: {
    price: number;
    color: string;
    size: string;
    image: string;
  }[];
  description: string;
}
