import { AxiosResponse } from 'axios';
import { FileResponseType, UploadType } from '../../types/uploads/uploadTypes';
import { createAxiosInstance } from '../axiosFactory';
import { handleApiError } from '../../utils/errorHandler';

const uploadServiceWithAuth = createAxiosInstance({
  useAuth: true,
  handleErrors: true,
  baseEndpoint: '/images',
});

const uploadService = createAxiosInstance({
  useAuth: false,
  handleErrors: false,
  baseEndpoint: '/images',
});

export const uploadFile = async (payload: UploadType): Promise<any> => {
  try {
    const formData = new FormData();

    // Assuming `payload` contains the file and other data
    formData.append('file', payload.file); // Attach the file to the form
    formData.append('altText', payload.altText); // If there are other fields, append them as well
    formData.append('description', payload.description);
    formData.append('entityId', payload.entityId.toString());
    formData.append('entityType', payload.entityType);
    formData.append('imageType', payload.imageType);

    const { data }: AxiosResponse<any> = await uploadServiceWithAuth.post(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set proper content type
        },
      }
    );
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getFileByEntityIdAndType = async (
  entityId: number,
  entityType: string,
  imageType: string
): Promise<FileResponseType> => {
  try {
    const response: AxiosResponse<FileResponseType> = await uploadService.get(
      `/one`,
      { params: { entityId, entityType, imageType } }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getFilesByEntityIdAndType = async (
  entityId: number,
  entityType: string
): Promise<FileResponseType[]> => {
  try {
    const response: AxiosResponse<FileResponseType[]> = await uploadService.get(
      `/multiple`,
      { params: { entityId, entityType } }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default uploadService;
