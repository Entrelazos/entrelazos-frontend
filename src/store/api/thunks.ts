// apiThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

interface FetchApiDataParams {
  apiService: (options: {
    method: string;
    data: any;
  }) => Promise<AxiosResponse<any>>;
  method?: string;
  data?: any;
}

export const fetchApiData = createAsyncThunk(
  'api/fetchApiData',
  async ({ apiService, method = 'GET', data = null }: FetchApiDataParams) => {
    const response: AxiosResponse<any> = await apiService({ method, data });
    return response.data;
  }
);
