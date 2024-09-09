import axios, { AxiosResponse } from 'axios';
import { CityType, CountryType, RegionType } from '../../types/geo/geoTypes';

const geoService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/geo`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});

export const getCountries = async (): Promise<CountryType[]> => {
  try {
    const response: AxiosResponse<CountryType[]> =
      await geoService.get('/countries');
    return response.data;
  } catch (error) {}
};

export const getRegionsByCountry = async (
  countryId: number
): Promise<RegionType[]> => {
  try {
    const response: AxiosResponse<RegionType[]> = await geoService.get(
      `/${countryId}/regions`
    );
    return response.data;
  } catch (error) {}
};

export const getCitiesByRegion = async (
  regionId: number
): Promise<CityType[]> => {
  try {
    const response: AxiosResponse<CityType[]> = await geoService.get(
      `/${regionId}/cities`
    );
    return response.data;
  } catch (error) {}
};

export default geoService;
