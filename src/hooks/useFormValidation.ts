import { useFormik } from 'formik';
import { createValidationSchema } from '../utils/validation';

export const useFormValidation = (
  initialValues,
  validationSchema,
  onSubmit
) => {
  const formik = useFormik({
    initialValues,
    validationSchema: createValidationSchema(validationSchema),
    onSubmit,
  });

  return formik;
};
