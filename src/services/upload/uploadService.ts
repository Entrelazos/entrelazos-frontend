import axios, { AxiosResponse } from 'axios';
import { FileResponseType, UploadType } from '../../types/uploads/uploadTypes';

const uploadService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_PORT
    ? `${import.meta.env.VITE_BASE_URL_PORT}/images`
    : 'https://pear-clear-sockeye.cyclic.app/images',
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

    const { data }: AxiosResponse<any> = await uploadService.post(
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
    throw Error('Failed to upload file');
  }
};

export const getFileByEntityIdAndType = async (
  entityId: number,
  entityType: string,
  imageType: string
): Promise<any> => {
  try {
    const response: AxiosResponse<FileResponseType> = await uploadService.get(
      `/one`,
      { params: { entityId, entityType, imageType } }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default uploadService;
