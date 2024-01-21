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
