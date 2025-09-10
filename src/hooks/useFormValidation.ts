import { useFormik, FormikValues } from 'formik';
import { createValidationSchema, ValidationSchemaMap } from '../utils/validation';

export const useFormValidation = <T extends FormikValues>(
  initialValues: T,
  validationSchema: ValidationSchemaMap<T>,
  onSubmit: (values: T) => void | Promise<void>
) => {
  const formik = useFormik({
    initialValues,
    validationSchema: createValidationSchema(validationSchema),
    onSubmit,
  });

  return formik;
};
