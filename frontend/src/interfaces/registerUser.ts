export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface Errors {
  name?: string;
  email?: string;
  password?: string;
}
