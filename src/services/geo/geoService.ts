import axios, { AxiosResponse } from 'axios';
import { CountryType } from '../../types/geo/geoTypes';

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

export default geoService;
