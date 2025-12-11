export {};

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      user?: {
        userId: string;
        role: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}
