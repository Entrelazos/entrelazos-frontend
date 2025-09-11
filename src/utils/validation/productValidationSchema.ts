import * as yup from 'yup';

// File size limit: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png', 
  'image/gif', 
  'image/webp',
  'image/svg+xml',
];

export const productValidationSchema = yup.object({
  product_name: yup
    .string()
    .required('El nombre del producto es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
    
  productDescription: yup
    .string()
    .required('La descripción del producto es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(5000, 'La descripción no puede exceder 5000 caracteres'),
    
  is_service: yup
    .boolean()
    .required('Debe especificar si es un producto o servicio'),
    
  is_public: yup
    .boolean()
    .required('Debe especificar la visibilidad del producto'),
    
  price: yup
    .number()
    .transform((value, originalValue) => {
      // Handle empty string or null values
      return originalValue === '' || originalValue === null ? undefined : value;
    })
    .required('El precio es requerido')
    .min(0, 'El precio debe ser un número positivo')
    .max(999999999, 'El precio no puede exceder $999,999,999')
    .typeError('El precio debe ser un número válido'),
    
  category_ids: yup
    .array()
    .of(
      yup
        .number()
        .required('La categoría es requerida')
        .integer('El ID de categoría debe ser un número entero')
        .positive('El ID de categoría debe ser positivo')
    )
    .min(1, 'Debe seleccionar al menos una categoría')
    .max(5, 'No puede seleccionar más de 5 categorías')
    .required('Las categorías son requeridas'),
    
  company_id: yup
    .number()
    .required('La empresa es requerida')
    .integer('El ID de empresa debe ser un número entero')
    .positive('El ID de empresa debe ser positivo'),
    
  files: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test('fileSize', 'El archivo es demasiado grande (máximo 5MB)', (value) => {
          if (!value) return true; // Optional files
          const file = value as File;
          return file.size <= MAX_FILE_SIZE;
        })
        .test('fileType', 'Tipo de archivo no soportado. Solo se permiten imágenes', (value) => {
          if (!value) return true; // Optional files
          const file = value as File;
          return ALLOWED_FILE_TYPES.includes(file.type);
        })
    )
    .max(10, 'No puede subir más de 10 archivos')
    .nullable(),
});

export type ProductFormData = yup.InferType<typeof productValidationSchema>;