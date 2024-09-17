import { CompanyItem } from '../companies/CompaniesTypes';

export interface UserCompany {
  id: number;
  jobPosition: string;
  company: CompanyItem;
  user: User;
}

export interface User {
  created_at: string; // Date string in ISO format
  updated_at: string; // Date string in ISO format
  id: number;
  cellphone: string; // Phone number with country code
  email: string;
  identification: string;
  is_active: boolean;
  name: string;
  password: string; // Hashed password
  refreshToken: string; // UUID format
}
