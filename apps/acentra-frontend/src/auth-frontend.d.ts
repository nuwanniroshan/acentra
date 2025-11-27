declare module 'auth_frontend/Login' {
  import { FC } from 'react';
  
  interface LoginProps {
    onSuccess?: () => void;
    onForgotPassword?: () => void;
    title?: string;
    subtitle?: string;
  }
  
  export const Login: FC<LoginProps>;
  export default Login;
}

declare module 'auth_frontend/ForgotPassword' {
  import { FC } from 'react';
  
  interface ForgotPasswordProps {
    onBack?: () => void;
    onSuccess?: () => void;
    title?: string;
    subtitle?: string;
  }
  
  export const ForgotPassword: FC<ForgotPasswordProps>;
  export default ForgotPassword;
}

declare module 'auth_frontend/ResetPassword' {
  import { FC } from 'react';
  
  interface ResetPasswordProps {
    token: string;
    onSuccess?: () => void;
    onBack?: () => void;
    title?: string;
    subtitle?: string;
  }
  
  export const ResetPassword: FC<ResetPasswordProps>;
  export default ResetPassword;
}

declare module 'auth_frontend/AuthProvider' {
  import { FC, ReactNode } from 'react';
  
  export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
  
  interface AuthProviderProps {
    children: ReactNode;
    onLoginSuccess?: (user: User) => void;
    onLogout?: () => void;
  }
  
  export const AuthProvider: FC<AuthProviderProps>;
  export const useAuth: () => {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
  };
  export default AuthProvider;
}