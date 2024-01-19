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
  isAuthenticated?: boolean;
}

export interface NotificationConfig {
  title?: string;
  ignoreSuccess?: boolean;
  ignoreError?: boolean;
  content?: string;
}
