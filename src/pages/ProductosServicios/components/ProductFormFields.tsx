import React, { memo } from 'react';
import {
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
  FormHelperText,
  Stack,
} from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ProductFormData } from '../../../types/product-form/ProductFormTypes';
import TiptapEditor from '../../../components/TipTapEditor/TipTapEditor';
import FileDropZone from '../../../components/FileDropZone/FileDropZone';

interface ProductFormFieldsProps {
  control: Control<ProductFormData>;
  register: any;
  errors: FieldErrors<ProductFormData>;
  watch: any;
  setValue: any;
  categories?: any[];
  categoriesLoading?: boolean;
  categoriesError?: string | null;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProductFormFields: React.FC<ProductFormFieldsProps> = memo(({
  control,
  register,
  errors,
  watch,
  setValue,
  categories,
  categoriesLoading,
  categoriesError,
}) => {
  const isServiceChecked = watch('is_service');
  const isPublicChecked = watch('is_public');
  const existingFilesWatch = watch('files');

  // Create category mapping
  const categoryMap = categories 
    ? new Map(categories.map(category => [category.id, category.category_name]))
    : new Map();

  return (
    <Stack spacing={3}>
      <TextField
        label='Nombre del producto'
        {...register('product_name')}
        error={!!errors.product_name}
        helperText={errors.product_name?.message}
        fullWidth
        margin='normal'
      />

      <Controller
        name='productDescription'
        control={control}
        rules={{ required: 'La descripción del producto es requerida' }}
        render={({ field }) => (
          <Box>
            <TiptapEditor 
              value={field.value} 
              onChange={field.onChange}
              placeholder='Descripción del producto...'
            />
            {errors.productDescription && (
              <FormHelperText error>
                {errors.productDescription.message}
              </FormHelperText>
            )}
          </Box>
        )}
      />

      <Box display='flex' gap={2}>
        <Controller
          name='is_service'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label='Es un servicio'
            />
          )}
        />

        <Controller
          name='is_public'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label='Público'
            />
          )}
        />
      </Box>

      <TextField
        label='Precio'
        type='number'
        {...register('price')}
        error={!!errors.price}
        helperText={errors.price?.message}
        fullWidth
        margin='normal'
        slotProps={{
          input: {
            startAdornment: <span style={{ marginRight: '8px' }}>$</span>,
          },
        }}
      />

      <Controller
        name='files'
        control={control}
        render={({ field: { onChange } }) => (
          <FileDropZone
            onDrop={(acceptedFiles: File[]) => {
              onChange(acceptedFiles);
              setValue('files', acceptedFiles);
            }}
            onRemoveImage={(file: File) => {
              const updatedFiles = existingFilesWatch.filter((f: File) => f !== file);
              setValue('files', updatedFiles);
            }}
            existingFiles={existingFilesWatch}
          />
        )}
      />

      {categoriesError && (
        <FormHelperText error>
          Error cargando categorías: {categoriesError}
        </FormHelperText>
      )}

      {categoriesLoading ? (
        <FormControl fullWidth margin='normal' disabled>
          <InputLabel>Cargando categorías...</InputLabel>
          <Select>
            <MenuItem disabled>Cargando...</MenuItem>
          </Select>
        </FormControl>
      ) : categories ? (
        <Controller
          name='category_ids'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin='normal' error={!!errors.category_ids}>
              <InputLabel id='categories-label'>Categorías</InputLabel>
              <Select
                labelId='categories-label'
                multiple
                {...field}
                value={field.value || []}
                input={<OutlinedInput label='Categorías' />}
                renderValue={(selected: number[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => (
                      <Chip
                        key={id}
                        label={categoryMap.get(id) || 'Desconocida'}
                        size='small'
                      />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_ids && (
                <FormHelperText error>
                  {errors.category_ids.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      ) : null}
    </Stack>
  );
});

ProductFormFields.displayName = 'ProductFormFields';

export default ProductFormFields;