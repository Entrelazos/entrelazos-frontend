// validation.ts
import * as yup from 'yup';

export const createValidationSchema = (schema: Record<string, yup.AnySchema>) => {
  return yup.object(schema);
}
