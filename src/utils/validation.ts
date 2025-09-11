import * as yup from 'yup';

export type ValidationSchemaMap<T> = {
  [K in keyof T]: yup.AnySchema;
};

export const createValidationSchema = <T>(schema: ValidationSchemaMap<T>) => {
  return yup.object(schema);
};
