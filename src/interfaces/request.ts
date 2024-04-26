import { ORDER_STATUS } from '@/constants';
import { product_model } from '@prisma/client';
import { bill_product } from '@prisma/client';

export interface CreateUserReq {
  username: string;
  password: string;
  dob: string;
  address?: string;
  gender?: string;
  phoneNumber: string;
  name: string;
  role: string;
}

// enum BILL_STATUS {
//   SUCCESS = 'SUCCESS',
//   REJECT = 'REJECT',
//   CANCEL = 'CANCEL',
// }

export interface CreateBillReq {
  user_id: number;
  city: string;
  district: string;
  wards: string;
  address: string;
  email: string;
  name: string;
  phone: string;
  note: string;
  status?: ORDER_STATUS;
  create_at: string;
  update_at: string;
  bill_product: bill_product[];
}

export interface CreateBillProductReq {
  bill_id: number;
  product_id: number;
  quantity: number;
}

export interface CreateCategoryReq {
  name: string;
  parent_id: number;
}

export interface CreateCartReq {
  total_amount: number;
  promotional_code: string;
  user_id: number;
}

export interface CreateCartProductReq {
  product_id: number;
  cart_id: number;
  quantity: number;
}

export interface CreatePostReq {
  title: string;
  content?: string;
  createAt?: string;
  image?: string;
  sapo?: string;
}

export interface CreateLookBookReq {
  title: string;
  content: string;
  createAt: string;
  url: string;
}

export enum PRODUCT_STATUS {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}

export interface ProductModelReq {
  color: string;
  size?: string;
  price: number;
  stock: number;
  image: string;
  id?: number;
}

export interface CreateProductReq {
  name: string;
  description?: string;
  price?: number;
  status?: PRODUCT_STATUS;
  categoryId?: number;
  model: ProductModelReq[];
}

export interface Summary {
  count: {
    product_count: number;
    sold: number;
    bill: number;
    customer: number;
    revenue: number;
  };
}
