import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCitiesByRegion,
  getCountries,
  getRegionsByCountry,
} from '../../services/geo/geoService';
import { CityType, CountryType, RegionType } from '../../types/geo/geoTypes';

export const fetchCountries = createAsyncThunk(
  'geo/fetchCountries',
  async (): Promise<CountryType[]> => {
    const response: CountryType[] = await getCountries();
    return response.filter((country) => country.code === '57');
  }
);
export const fetchRegions = createAsyncThunk(
  'geo/fetchRegions',
  async (countryId: number): Promise<RegionType[]> => {
    const response: RegionType[] = await getRegionsByCountry(countryId);
    return response;
  }
);

export const fetchCities = createAsyncThunk(
  'geo/fetchRegions',
  async (): Promise<CityType[]> => {
    const response: CityType[] = await getCitiesByRegion();
    return response;
  }
);
