export interface CountryType {
  id: number;
  name: string;
  code: string;
  alpha_code: string;
}

export interface RegionType {
  id: number;
  name: string;
  code: string;
  country_id: string;
}

export interface CityType {
  id: number;
  name: string;
  code: string;
  region_id: string;
}
