export interface Event {
  title: string;
  start: Date;
  end: Date;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  name: string;
  password: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  access: string | null;
  authenticated: boolean;
  user: null | User;
  signuperror?: string | null;
  loginerror?: string | null;
  signupmessage: string | null;
  isopen: boolean;
  loading: boolean;
}
