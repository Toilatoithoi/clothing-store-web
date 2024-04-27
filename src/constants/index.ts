// constant nơi chứa các biến hằng số
// số bản ghi lấy ra trong 1 lần request
// export để có thể dùng nhiều chỗ
export const FETCH_COUNT = 50;

// nếu bên chỗ viết hàm chỉ export thì sẽ gọi thể kiểu import {} from 
// import {formatNumber} from '@/utils/index';
// formatNumber(FETCH_COUNT)


export enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}
// hằng số dùng cho nhiều chỗ thì dùng enum
export enum SORT_TYPE {
  PRICE_ASC = 'PRICE_ASC', // giá thấp -> cao
  PRICE_DESC = 'PRICE_DESC',// cao -> thấp
  TIME = 'TIME', // mới nhất
}

export enum ROLES {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum PRODUCT_STATUS {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED'
}

export enum ORDER_STATUS {
  NEW = 'NEW',// Chờ xác nhận,
  CONFIRM = 'CONFIRM', // Đã xác nhận, chuẩn bị hàng 
  REJECT = 'REJECT', // Từ chối -> lý do (hết hàng, không vận chuyển được ...)
  TRANSPORTED = 'TRANSPORTED',// đang vận chuyển 
  SUCCESS = 'SUCCESS', // Giao hàng thành công
  FAILED = 'FAILED', //Giao hàng thất bại -> khách hàng bom,....
  CANCELED = 'CANCELED', // Đã hủy -> lý do(khách huỷ đơn ...)
  REQUEST_CANCEL = 'REQUEST_CANCEL' //yêu cầu hủy -> hàng hỏng, ....
}