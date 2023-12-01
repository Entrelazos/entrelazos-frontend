export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
  cellphone: string;
  email: string;
  password: string;
  identification: string;
  is_active: boolean;
  name: string;
  role_id: number;
  city_id: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  errorMessage: string | null;
  authError: boolean | null;
  registerUserSucces: boolean | null;
  accessToken: string | null;
  refreshToken: string | null;
}