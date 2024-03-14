export interface City {
  id: number;
  name: string;
  code: string;
  region: Region;
}

export interface Region {
  id: number;
  name: string;
  code: string;
  country: Country;
}

export interface Country {
  id: number;
  alpha_code: string;
  code: string;
  name: string;
}

export interface Address {
  city: City;
  id: number;
  nomenclature: string;
}
