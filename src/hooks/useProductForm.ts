import { useState, useCallback } from 'react';
import {
  ProductFormData,
  ProductListItem,
  UseProductFormReturn,
} from '../types/product-form/ProductFormTypes';
// Simple UUID generator without external dependency
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

interface UseProductFormProps {
  onSubmit: (data: ProductFormData[]) => Promise<void>;
  onProductAdd?: (product: ProductListItem) => void;
  onProductUpdate?: (product: ProductListItem, index: number) => void;
  onProductDelete?: (index: number) => void;
}

export const useProductForm = ({
  onSubmit,
  onProductAdd,
  onProductUpdate,
  onProductDelete,
}: UseProductFormProps): UseProductFormReturn => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduct = useCallback(
    (data: ProductFormData) => {
      const newProduct: ProductListItem = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
      };

      setProducts((prev) => [...prev, newProduct]);
      onProductAdd?.(newProduct);
    },
    [onProductAdd]
  );

  const updateProduct = useCallback(
    (index: number, data: ProductFormData) => {
      setProducts((prev) => {
        const updated = [...prev];
        const updatedProduct = { ...updated[index], ...data };
        updated[index] = updatedProduct;
        onProductUpdate?.(updatedProduct, index);
        return updated;
      });
      setEditIndex(null);
    },
    [onProductUpdate]
  );

  const deleteProduct = useCallback(
    (index: number) => {
      setProducts((prev) => {
        const updated = prev.filter((_, idx) => idx !== index);
        return updated;
      });

      // Reset edit state if we're deleting the item being edited
      if (editIndex === index) {
        setEditIndex(null);
      } else if (editIndex !== null && editIndex > index) {
        // Adjust edit index if needed
        setEditIndex(editIndex - 1);
      }

      onProductDelete?.(index);
    },
    [editIndex, onProductDelete]
  );

  const editProduct = useCallback((index: number) => {
    setEditIndex(index);
  }, []);

  const submitAllProducts = useCallback(async () => {
    if (products.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(products);
      setProducts([]);
      setEditIndex(null);
    } catch (error) {
      console.error('Error submitting products:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [products, onSubmit]);

  const clearProducts = useCallback(() => {
    setProducts([]);
    setEditIndex(null);
  }, []);

  return {
    products,
    editIndex,
    isSubmitting,
    addProduct,
    updateProduct,
    deleteProduct,
    editProduct,
    submitAllProducts,
    clearProducts,
  };
};
