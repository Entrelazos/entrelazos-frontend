import { useFormik, FormikValues } from 'formik';
import { createValidationSchema } from '../utils/validation';

export const useFormValidation = <T extends FormikValues>(
  initialValues: T,
  validationSchema: any,
  onSubmit: (values: T) => void | Promise<void>
) => {
  const formik = useFormik({
    initialValues,
    validationSchema: createValidationSchema(validationSchema),
    onSubmit,
  });

  return formik;
};
