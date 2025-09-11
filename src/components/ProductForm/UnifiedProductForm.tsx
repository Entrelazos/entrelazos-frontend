import React, { memo } from 'react';
import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Checkbox,
  Stack,
  Box,
  CircularProgress,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Skeleton,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { UnifiedProductFormProps } from '../../types/product-form/UnifiedProductFormTypes';
import { useUnifiedProductForm } from '../../hooks/useUnifiedProductForm';
import TiptapEditor from '../TipTapEditor/TipTapEditor';
import FileDropZone from '../FileDropZone/FileDropZone';

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

const UnifiedProductForm: React.FC<UnifiedProductFormProps> = memo(({
  mode,
  onSubmit,
  onCancel,
  initialData,
  existingImages = [],
  loading = false,
  submitButtonText,
  showCancelButton = false,
  companyId,
}) => {
  const { 
    data: categories, 
    loading: categoriesLoading 
  } = useSelector((state: RootState) => state.categories);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    currentExistingImages,
    newFiles,
    handleRemoveExistingImage,
    handleNewFilesChange,
  } = useUnifiedProductForm({
    mode,
    initialData,
    existingImages,
    companyId,
  });


  // Create category mapping
  const categoryMap = categories 
    ? new Map(categories.map(category => [category.id, category.category_name]))
    : new Map();

  const handleFormSubmit = (data: any) => {
    // Combine existing image IDs with new files
    const finalData = {
      ...data,
      files: newFiles,
      existingImages: currentExistingImages.map(img => img.id),
    };
    onSubmit(finalData);
  };

  const getSubmitButtonText = () => {
    if (submitButtonText) return submitButtonText;
    return mode === 'edit' ? 'Actualizar Producto' : 'Crear Producto';
  };

  if (loading) {
    return (
      <Box p={3}>
        <Skeleton variant='rectangular' height={60} sx={{ mb: 2 }} />
        <Skeleton variant='rectangular' height={120} sx={{ mb: 2 }} />
        <Skeleton variant='rectangular' height={60} sx={{ mb: 2 }} />
        <Skeleton variant='rectangular' height={60} />
      </Box>
    );
  }

  return (
    <Box component='form' onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={3}>
        {/* Product Name */}
        <TextField
          label='Nombre del producto'
          {...register('product_name')}
          error={!!errors.product_name}
          helperText={errors.product_name?.message}
          fullWidth
          required
        />

        {/* Product Description */}
        <Box>
          <Controller
            name='productDescription'
            control={control}
            rules={{ required: 'La descripción del producto es requerida' }}
            render={({ field }) => (
              <>
                <TiptapEditor 
                  value={field.value} 
                  onChange={field.onChange}
                />
                {errors.productDescription && (
                  <FormHelperText error>
                    {errors.productDescription.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </Box>

        {/* Service and Public switches */}
        <Box display='flex' gap={3} flexWrap='wrap'>
          <Controller
            name='is_service'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  mode === 'create' ? (
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  ) : (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )
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
                  mode === 'create' ? (
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  ) : (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )
                }
                label='Público'
              />
            )}
          />
        </Box>

        {/* Price */}
        <TextField
          label='Precio'
          type='number'
          {...register('price')}
          error={!!errors.price}
          helperText={errors.price?.message}
          fullWidth
          required
          slotProps={{
            input: {
              startAdornment: <span style={{ marginRight: '8px' }}>$</span>,
            },
          }}
        />

        {/* Categories */}
        {categoriesLoading ? (
          <Skeleton variant='rectangular' height={56} />
        ) : categories ? (
          <Controller
            name='category_ids'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category_ids}>
                <InputLabel id='categories-label'>Categorías</InputLabel>
                <Select
                  labelId='categories-label'
                  multiple
                  required
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

        {/* File Upload */}
        <FileDropZone
          onDrop={handleNewFilesChange}
          existingFiles={currentExistingImages as any}
          onRemoveImage={(item: any) => {
            if (item.id) {
              // Existing image
              handleRemoveExistingImage(item.id);
            } else {
              // New file - handle file removal from newFiles array
              const updatedFiles = newFiles.filter(f => f !== item);
              handleNewFilesChange(updatedFiles);
            }
          }}
        />

        {/* Form Actions */}
        <Stack direction='row' spacing={2} justifyContent='flex-end' pt={2}>
          {showCancelButton && onCancel && (
            <Button
              type='button'
              variant='outlined'
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={loading || !isValid}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Procesando...' : getSubmitButtonText()}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
});

UnifiedProductForm.displayName = 'UnifiedProductForm';

export default UnifiedProductForm;