// utils là nơi chưa các hàm format 
// fomat số
// export được sử dụng để xuất (export) hàm formatNumber ra khỏi module, để có thể được sử dụng ở nơi khác trong mã nguồn
// Đây là biểu thức hàm (arrow function) có tham số là value kiểu number trong typescript bắt buộc phải khai báo kiểu dữ liệu cho biến
export const formatNumber = (value: number) => {
  return 0;
}

// formatNumber(1) đúng
// formatNumber('aaa') sai

// dùng cách này khi chỉ có một cái
// const formatNumber = (value: number) => {
//   return 0;
// }

// export default formatNumber

// khi khai bá như này thì bên gọi chỉ cần
//import formatNumber from '@/utils'
//