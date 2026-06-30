export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Credentials {
  email: string;
  password?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AuthData {
  user: User;
  token: string;
}
