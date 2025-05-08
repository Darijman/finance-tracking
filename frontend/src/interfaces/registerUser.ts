export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface Errors {
  name?: string;
  email?: string;
  password?: string;
}
