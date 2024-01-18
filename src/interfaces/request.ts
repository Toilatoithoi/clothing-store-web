import { product_model } from '@prisma/client';
import { bill_product } from '@prisma/client';

export interface CreateUserReq {
  username: string;
  password: string;
  dob: string;
  address: string;
  gender: string;
  phoneNumber: string;
  name: string;
}

enum BILL_STATUS {
  SUCCESS = 'SUCCESS',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
}

export interface CreateBillReq {
  user_id: number;
  city: string;
  district: string;
  wards: string;
  address: string;
  note: string;
  status?: BILL_STATUS;
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
  content: string;
  createAt: string;
}


enum PRODUCT_STATUS {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}


interface ProductModel {
  color: string;
  size: string;
  price: number;
  stock: number;
  image: string;
}

export interface CreateProductReq {
  name: string;
  description?: string;
  status?: PRODUCT_STATUS;
  category_id?: number;
  model: product_model[]
}