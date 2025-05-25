import 'express';

declare module 'express' {
  export interface Request {
    user: {
      id: number;
      name: string;
      roleId: number;
      iat: number;
      exp: number;
    };
  }
}
