import { List } from '@/components/ListBill';
import { UserPayload } from '@/app/(customer)/user/page';
import { METHOD } from '@/constants';
import { PaginationRes } from '@/interfaces';
import { ProductDetail, ProductModel } from '@/interfaces/model';
import { useMutation, useSWRWrapper } from '@/store/custom';

export interface ProductCart extends ProductModel {
  // productName: string;
  product_model_id: number;
  quantity: number;
  product: ProductDetail;
}

export interface Payment {
  id: number;
  created_at: any;
  name: string;
  username: string;
  phone: string;
  productCart: ProductCart[];
  city?: string;
  district?: string;
  wards?: string;
  address?: string;
  note?: string;
}

export interface UserPayMENT {
  name: string;
  phoneNumber: string;
  // password: string;
  gender: string;
  address: string;
  dob: string;
  username: string;
  role: string;
}

export const useCart = () => {
  // lấy dữ liệu cart từ api
  const { data, mutate, isLoading } = useSWRWrapper<ProductCart[]>(
    '/api/cart',
    {
      url: '/api/cart',
      method: METHOD.GET,
    }
  );
  // gọi trigger là dữ liệu nhập vào khi cần addToCart vừa craete vừa update
  const { trigger } = useMutation<ProductCart[]>('/api/cart', {
    url: '/api/cart',
    method: METHOD.POST,
  });

  // truyền {id} trong hàm api có cơ chế replance string id thay bằng giá trị tương ứng
  // phải điều chỉnh key cho delete và get giống nhau để khi delete xong nó sẽ get lại do trùng key, có thể để trùng key
  // nếu khô g phải mutute lại key get nếu không trùng key sau khi delete để refesh lại dữ liệu
  const { trigger: product } = useMutation<ProductCart[]>('/api/cart', {
    url: `/api/cart/{product_model_id}`,
    method: METHOD.DELETE,
  });
  const updateCart = (model: ProductCart, override?: boolean) => {
    // hiểu là truyền value cho global state /api/cart
    trigger({
      quantity: model.quantity,
      product_model_id: model.product_model_id,
      override,
    });
  };

  // global state dùng key để lấy gia 1 giá trị bất kì
  // key hiểu nôm na là id để lấy ra giá trị của state

  const addToCart = (model: ProductCart, override?: boolean) => {
    trigger({
      quantity: model.quantity,
      product_model_id: model.product_model_id,
      override,
    });
  };

  const deleteToCart = (model: ProductCart) => {
    product({
      product_model_id: model.product_model_id,
    });
  };

  return {
    // data là dữ liệu của giỏ hàng lấy từ api
    data,
    updateCart,
    addToCart,
    deleteToCart,
    isLoading,
    mutate,
  };
};

export const useBill = (options: {
  onCreateSuccess?: (data: Record<string, string>) => void;
  componentId?: string;
}) => {
  // lấy dữ liệu bill từ api
  const { data, mutate } = useSWRWrapper<PaginationRes<Payment>>('/api/bill', {
    url: '/api/bill',
    method: METHOD.GET,
  });

  // gọi trigger là dữ liệu nhập vào khi cần addToCart vừa craete vừa update
  const { trigger } = useMutation<Record<string, string>>('/api/bill', {
    url: '/api/bill',
    method: METHOD.POST,
    // thực hiện loading
    loading: true,
    componentId: options.componentId,
    onSuccess(data) {
      // onCreateSuccess có thể undefine nên phải ? nếu undefine thì sẽ không thực hiện
      options.onCreateSuccess?.(data);
    },
    notification: {
      title: 'Thanh toán đơn hàng',
      content: 'Thanh toán đơn hàng thành công!',
    },
  });

  const { trigger: bill } = useMutation<UserPayload>('/api/bill', {
    url: '/api/bill/{bill_id}',
    method: METHOD.PUT,
    onSuccess(data) {
      console.log(data);
    },
    // thực hiện loading
    componentId: options.componentId,
    loading: true,
    notification: {
      // config thông báo
      // title dùng chung cho thành công và thấT bại
      title: 'Huỷ đơn hàng',
      // chỉ dùng cho thành công
      content: 'Huỷ đơn hàng thành công',
    },
  });

  // global state dùng key để lấy gia 1 giá trị bất kì
  // key hiểu nôm na là id để lấy ra giá trị của state

  const addToBill = (data: {
    name: string;
    email: string;
    phone: string;
    productCart: ProductCart[];
    city?: string;
    district?: string;
    wards?: string;
    address?: string;
    note?: string;
  }) => {
    trigger({
      //đầu vào của api tạo bill
      bill_product: data.productCart, // {product_mode_id: number, quantity: number},
      city: data.city,
      name: data.name,
      email: data.email,
      phone: data.phone,
      district: data.district,
      wards: data.wards,
      address: data.address,
      note: data.note,
    });
  };

  const updateToBill = (data: List) => {
    bill({
      //đầu vào của api tạo bill
      bill_id: data.id,
    });
  };

  return {
    // data là dữ liệu của giỏ hàng lấy từ api
    data,
    addToBill,
    updateToBill,
  };
};

export const useUser = (options: { componentId?: string }) => {
  // lấy dữ liệu user từ api
  const { data } = useSWRWrapper<UserPayMENT>('/api/user', {
    url: '/api/user',
    method: METHOD.GET,
  });

  // gọi trigger là dữ liệu nhập vào khi cần updateToUser sẽ update
  const { trigger } = useMutation<UserPayload>('/api/user/verifyToken', {
    url: '/api/user/verifyToken',
    method: METHOD.PUT,
    onSuccess(data) {
      console.log(data);
    },
    // thực hiện loading
    componentId: options.componentId,
    loading: true,
    notification: {
      // config thông báo
      // title dùng chung cho thành công và thấT bại
      title: 'Cập nhật tài khoản',
      // chỉ dùng cho thành công
      content: 'Cập nhật tài khoản thành công',
    },
  });
  // global state dùng key để lấy gia 1 giá trị bất kì
  // key hiểu nôm na là id để lấy ra giá trị của state

  const updateToUser = (data: UserPayload) => {
    trigger({
      //đầu vào của api tạo bill
      name: data.name,
      phoneNumber: data.phoneNumber,
      // password: string;
      gender: data.gender,
      address: data.address,
      dob: data.dob,
    });
  };

  return {
    // data là dữ liệu của giỏ hàng lấy từ api
    data,
    updateToUser,
  };
};
