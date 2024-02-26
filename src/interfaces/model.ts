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

export interface ProductModel {
  price: number;
  color: string;
  size: string;
  image: string;
  stock: number;
  id: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  category: Category;
  product_model: ProductModel[];
  description: string;
}

export interface PostRes {
  id: number;
  title: string;
  content: string;
  createAt: string;
  image: string;
}

export interface Bill{
  id: number;
  user_id: number;
  city: string;
  district: string;
  wards: string;
  address: string;
  note: string;
  status: string;
  create_at: string;
  update_at: string;
  bill_product: BillProduct[];

}

export interface BillProduct {
  product_model_id: number;
  quantity: number;
  id: number;
}


