import { AxiosResponse } from 'axios';
import {
  CreateProductType,
  ProductApiResponse,
  ProductByCompanyApiResponse,
  ProductItem,
} from '../../types/products/ProductsTypes';
import { ApprovalStatus } from '../../constants/constants';
import { createAxiosInstance } from '../axiosFactory';

const productServiceWithAuth = createAxiosInstance({
  useAuth: true,
  handleErrors: true,
  baseEndpoint: '/products',
});

const productService = createAxiosInstance({ baseEndpoint: '/products' });

export const getProductsByCompanyId = async (
  companyId: number,
  options: { page: number; limit: number }
): Promise<ProductByCompanyApiResponse> => {
  try {
    const response: AxiosResponse<ProductByCompanyApiResponse> =
      await productService.get(`/byCompany/${companyId}`, {
        params: options,
      });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get products');
  }
};

export const getProductsByStatus = async (
  status: ApprovalStatus,
  options: { page: number; limit: number }
): Promise<ProductByCompanyApiResponse> => {
  try {
    const response: AxiosResponse<ProductByCompanyApiResponse> =
      await productServiceWithAuth.get(`/products-status`, {
        params: { status, ...options },
      });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get products');
  }
};

export const updateProductStatus = async (
  productIds: number[],
  status: ApprovalStatus
): Promise<ProductItem> => {
  try {
    const response = await productServiceWithAuth.patch('/update-status', {
      productIds,
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update product'
    );
  }
};

export const getProductsByCategoryId = async (
  categoryId: number
): Promise<ProductApiResponse> => {
  try {
    const response: AxiosResponse<ProductApiResponse> =
      await productService.get(`/byCategory/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get products');
  }
};

export const createProducts = async (
  products: CreateProductType[]
): Promise<ProductApiResponse> => {
  try {
    const formData = new FormData();

    // Loop through each product and append its data to FormData
    products.forEach((product, index) => {
      formData.append(`products[${index}][product_name]`, product.product_name);
      formData.append(
        `products[${index}][productDescription]`,
        product.productDescription
      );
      formData.append(
        `products[${index}][is_service]`,
        String(product.is_service)
      );
      formData.append(
        `products[${index}][is_public]`,
        String(product.is_public)
      );

      formData.append(`products[${index}][price]`, String(product.price));
      formData.append(
        `products[${index}][company_id]`,
        String(product.company_id)
      );

      // Append category_ids array
      product.category_ids.forEach((id) => {
        formData.append(`products[${index}][category_ids][]`, String(id));
      });

      // Append files
      product.files.forEach((file) => {
        formData.append(`products[${index}][files][]`, file);
      });
    });

    const response: AxiosResponse<ProductApiResponse> =
      await productServiceWithAuth.post(`/bulk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to create products'
    );
  }
};

/**
 * Update a single product
 * @param productId - ID of the product to update
 * @param productData - Updated product details
 * @returns Updated product
 */
export const updateProduct = async (
  productId: number,
  productData: CreateProductType
): Promise<ProductItem> => {
  try {
    const formData = new FormData();

    // Append product fields to FormData
    formData.append('product_name', productData.product_name);
    formData.append('productDescription', productData.productDescription);
    formData.append('is_service', String(productData.is_service));
    formData.append('is_public', String(productData.is_public));
    formData.append('price', String(productData.price));
    formData.append('company_id', String(productData.company_id));

    // Append category IDs
    productData.category_ids.forEach((id) => {
      formData.append('category_ids[]', String(id));
    });

    // ✅ Append existing images to keep (Image IDs)
    if (productData.existingImages) {
      productData.existingImages.forEach((imageId) => {
        formData.append('existingImages[]', String(imageId));
      });
    }

    // ✅ Append new files if available (only new ones)
    if (productData.files) {
      productData.files.forEach((file) => {
        if (file instanceof File) {
          formData.append('files[]', file);
        }
      });
    }

    const response: AxiosResponse<ProductItem> =
      await productServiceWithAuth.put(`/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update product'
    );
  }
};

export const getSingleProduct = async (id: string): Promise<ProductItem> => {
  try {
    const response = await productService.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get product');
  }
};

export default productService;
