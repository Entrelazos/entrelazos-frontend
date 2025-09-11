import { FC, useEffect, useMemo, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Box,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  CircularProgress,
  Alert,
  Skeleton,
  Typography,
} from '@mui/material';
import SocialMediaFields from './SocialMediaFields';
import AddressSection from './AddressSection';
import { AddressData } from '../../../types/address/AddressTypes';
import { SocialType } from '../../../types/social/SocialTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchCategories } from '../../../store/categories/categoriesThunks';
import { useCompanyForm } from '../../../hooks/useCompanyForm';

export interface FormData {
  name: string;
  nit: string;
  description: string;
  addresses: AddressData[];
  social: SocialType;
  categoryIds: number[];
  userIds: number[];
}

interface CompanyFormProperties {
  handleSubmit: (formData: FormData) => void;
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

const CompanyForm: FC<CompanyFormProperties> = ({ handleSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.categories);
  const { uid } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    companyInfo,
    addresses,
    social,
    errors,
    handleCompanyInfoChange,
    handleCategoryChange,
    handleSocialChange,
    handleSocialDirectChange,
    handleAddressChange,
    addAddress,
    removeAddress,
    validateForm,
  } = useCompanyForm();

  useEffect(() => {
    if (!data) {
      dispatch(fetchCategories());
    }
  }, [dispatch, data]);

  // Create a mapping of category IDs to category names
  const categoryMap = useMemo(
    () =>
      new Map(data?.map((category) => [category.id, category.category_name])),
    [data]
  );

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid } = validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { name, nit, description, categories } = companyInfo;

      await handleSubmit({
        name,
        nit,
        description,
        addresses,
        social,
        categoryIds: categories,
        userIds: uid ? [parseInt(uid)] : [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Card raised sx={{ borderRadius: '12px' }}>
        <CardHeader title='Información' />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction='column' spacing={3}>
                <TextField
                  name='name'
                  label='Nombre'
                  variant='outlined'
                  required
                  fullWidth
                  value={companyInfo.name}
                  onChange={handleCompanyInfoChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  name='nit'
                  label='NIT'
                  variant='outlined'
                  required
                  fullWidth
                  value={companyInfo.nit}
                  onChange={handleCompanyInfoChange}
                  error={!!errors.nit}
                  helperText={errors.nit}
                  placeholder='123456789-0'
                />
                {categoriesError && (
                  <Alert severity='error' sx={{ mb: 2 }}>
                    Error cargando categorías: {categoriesError}
                  </Alert>
                )}
                {categoriesLoading ? (
                  <Skeleton variant='rectangular' height={56} />
                ) : data ? (
                  <FormControl error={!!errors.categories}>
                    <InputLabel id='categories-label'>Categorías</InputLabel>
                    <Select<number[]>
                      name='categories'
                      labelId='categories-label'
                      id='categories-select'
                      required
                      multiple
                      value={companyInfo.categories}
                      onChange={(event) => handleCategoryChange(event)}
                      input={
                        <OutlinedInput
                          id='select-multiple-chip'
                          label='Categorías'
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          {selected.map((id) => (
                            <Chip key={id} label={categoryMap.get(id)} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {data.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categories && (
                      <Typography
                        variant='caption'
                        color='error'
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.categories}
                      </Typography>
                    )}
                  </FormControl>
                ) : null}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction='column' spacing={3}>
                <TextField
                  name='description'
                  label='Descripción'
                  variant='outlined'
                  multiline
                  rows={8}
                  fullWidth
                  value={companyInfo.description}
                  onChange={handleCompanyInfoChange}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader title='Redes Sociales' />
            <CardContent>
              <SocialMediaFields
                social={social}
                onSocialChange={handleSocialChange}
                onSocialDirectChange={handleSocialDirectChange}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AddressSection
            addresses={addresses}
            onAddressChange={handleAddressChange}
            onAddAddress={addAddress}
            onRemoveAddress={removeAddress}
          />
        </Grid>
      </Grid>

      <Box display='flex' gap={2} justifyContent='end'>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Creando...' : 'Crear'}
        </Button>
      </Box>
    </form>
  );
};

export default CompanyForm;
