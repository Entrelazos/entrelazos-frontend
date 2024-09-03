import { CompanyItem } from '../companies/CompaniesTypes';

export interface UserCompany {
  id: number;
  jobPosition: string;
  company: CompanyItem;
}
