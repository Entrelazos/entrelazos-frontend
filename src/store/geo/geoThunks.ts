import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCountries } from '../../services/geo/geoService';
import { CountryType } from '../../types/geo/geoTypes';

export const fetchCountries = createAsyncThunk(
  'geo/fetchCountries',
  async (): Promise<CountryType[]> => {
    const response: CountryType[] = await getCountries();
    return response.filter((country) => country.code === '57');
  }
);
