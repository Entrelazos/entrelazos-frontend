import { AxiosResponse } from 'axios';
import { CityType, CountryType, RegionType } from '../../types/geo/geoTypes';
import { createAxiosInstance } from '../axiosFactory';

const geoService = createAxiosInstance({ baseEndpoint: '/geo' });

export const getCountries = async (): Promise<CountryType[]> => {
  try {
    const response: AxiosResponse<CountryType[]> =
      await geoService.get('/countries');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get countries');
  }
};

export const getRegionsByCountry = async (
  countryId: number
): Promise<RegionType[]> => {
  try {
    const response: AxiosResponse<RegionType[]> = await geoService.get(
      `/${countryId}/regions`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get regions');
  }
};

export const getCitiesByRegion = async (
  regionId: number
): Promise<CityType[]> => {
  try {
    const response: AxiosResponse<CityType[]> = await geoService.get(
      `/${regionId}/cities`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get cities');
  }
};

export default geoService;
