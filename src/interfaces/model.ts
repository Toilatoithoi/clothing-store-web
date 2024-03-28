export interface ProductRes {
  id: number;
  name: string;
  image?: string;
  price: {
    priceMin: number;
    priceMax: number;
    price: number;
  };
  product_model?: {
    color?: string;
    size?: string;
  }
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
  sold: number;
  id: number;
}

export interface ImageProduct {
  id: number;
  url: string;
  product_model_id: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  category: Category;
  product_model: ProductModel[];
  description: string;
  image_product: ImageProduct[];
}

export interface PostRes {
  id: number;
  title: string;
  content: string;
  createAt: string;
  image: string;
  sapo: string;
}

export interface LookBookRes {
  id: number;
  title: string;
  content: string;
  createAt: string;
  url: string;
}

export interface Bill {
  [x: string]: any;
  id: number;
  user: User;
  city: string;
  district: string;
  wards: string;
  address: string;
  note: string;
  status: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  bill_product: BillProduct[];

}

export interface BillProduct {
  product_model: {
    product: {
      name: string;
    },
    price: number;
    size: number;
    color: string;
    image: string;
  };
  quantity: number;
  id: number;
}

export interface User {
  name: string;
  phoneNumber: string;
  dob: string;
  username: string;
}


