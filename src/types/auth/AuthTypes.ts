import { CompanyItem } from '../companies/CompaniesTypes';
import { UserCompany } from '../user/UserTypes';

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
  name: string;
  email: string;
  id: string;
  is_active: boolean;
  companies: UserCompany[];
  roles: [];
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  status?: 'checking' | 'authenticated' | 'not-authenticated';
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  companies?: UserCompany[];
  roles?: [];
  errorMessage?: string | null;
  authError?: boolean | null;
  registerUserSuccess?: boolean | null;
  accessToken?: string | null;
  refreshToken?: string | null;
}
