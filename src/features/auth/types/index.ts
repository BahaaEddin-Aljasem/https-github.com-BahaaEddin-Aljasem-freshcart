// Response shapes are UNVERIFIED assumptions: confirm against Postman.
export interface AuthUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  user?: AuthUser;
  token?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  localOnly?: boolean;
  user?: AuthUser;
}

export interface MessageResponse {
  message?: string;
  statusMsg?: string;
  status?: string;
}
