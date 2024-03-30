export interface UserInfo {
  name: string;
  dob: Date;
  age?: number;
}

// const user: UserInfo = {
//   name: 'Duc',
//   dob: new Date(),
//   age: 18
// }

export interface AppStatus {
  // true nếu là đã đăng nhập
  isAuthenticated?: boolean;
}

export interface NotificationConfig {
  title?: string;
  ignoreSuccess?: boolean;
  ignoreError?: boolean;
  content?: string;
}

export interface IPagination {
  totalCount: number;
  page: number;
  totalPage: number;
}
export interface PaginationRes<T> {
  items: T[];
  pagination: IPagination
}
