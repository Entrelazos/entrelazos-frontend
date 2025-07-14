import { FC, useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Box,
  Stack,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import CompanyAddressComponent from './company.address.component';
import { AddressData } from '../../../types/address/AddressTypes';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../companies.form.styles.scss';
import { SocialType } from '../../../types/social/SocialTypes';
import { SOCIAL_NETWORK_DATA } from '../../../constants/constants';
import { MuiTelInput } from 'mui-tel-input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchCategories } from '../../../store/categories/categoriesThunks';

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
  const { data } = useSelector((state: RootState) => state.categories);
  const { uid } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (!data) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);
  // Create a mapping of category IDs to category names
  const categoryMap =
    data &&
    new Map(data.map((category) => [category.id, category.category_name]));
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    nit: '',
    description: '',
    categories: [],
  });
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [social, setSocial] = useState<SocialType>({
    email: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    phone_number: '',
    whatsapp: '',
    x: '',
  });

  const handleCompanyInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompanyInfo({ ...companyInfo, [event.target.name]: event.target.value });
  };

  const handleSocialChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    basePath: string
  ) => {
    setSocial({
      ...social,
      [event.target.name]: `${basePath}${event.target.value}`,
    });
  };

  const handleAddressChange = (index: number, newData: AddressData) => {
    setAddresses((prevAddresses) => {
      const updatedAddresses = [...prevAddresses];
      updatedAddresses[index] = newData;
      return updatedAddresses;
    });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, nit, description, categories } = companyInfo;

    handleSubmit({
      name,
      nit,
      description,
      addresses,
      social,
      categoryIds: categories,
      userIds: [parseInt(uid)],
    });
  };

  const addAddressComponent = () => {
    setAddresses((prevAddresses) => [
      ...prevAddresses,
      { nomenclature: '', region: '', city: '', country: '' },
    ]);
  };

  const removeAddressComponent = () => {
    setAddresses((prevAddresses) => prevAddresses.slice(0, -1));
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
        <CardHeader title='Informacion' />
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
                />
                <TextField
                  name='nit'
                  label='NIT'
                  variant='outlined'
                  required
                  fullWidth
                  value={companyInfo.nit}
                  onChange={handleCompanyInfoChange}
                />
                {data && (
                  <FormControl>
                    <InputLabel id='demo-multiple-chip-label'>
                      Categorias
                    </InputLabel>
                    <Select
                      name='categories'
                      labelId='demo-multiple-chip-label'
                      id='demo-multiple-chip'
                      required
                      multiple
                      value={companyInfo.categories}
                      onChange={handleCompanyInfoChange}
                      input={
                        <OutlinedInput id='select-multiple-chip' label='Chip' />
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
                  </FormControl>
                )}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction='column' spacing={3}>
                <TextField
                  name='description'
                  label='Descripcion'
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
              <Stack direction='column' spacing={3}>
                {SOCIAL_NETWORK_DATA.map(
                  ({
                    name,
                    label,
                    icon: Icon,
                    fieldType,
                    basePath,
                    isRequired,
                  }) =>
                    name === 'phone_number' || name === 'whatsapp' ? (
                      <MuiTelInput
                        defaultCountry='CO'
                        margin='normal'
                        fullWidth
                        key={name}
                        label={label}
                        name={name}
                        autoComplete={name}
                        required={isRequired}
                        value={social[name] ?? ''}
                        onChange={(value) => {
                          setSocial({
                            ...social,
                            [name]: value,
                          });
                        }}
                      />
                    ) : (
                      <TextField
                        name={name}
                        label={label}
                        type={fieldType}
                        key={name}
                        required={isRequired}
                        onChange={(event) =>
                          handleSocialChange(event, basePath)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon />
                              <Typography
                                variant='body2'
                                color='textSecondary'
                                style={{ marginLeft: 8 }} // Adjust spacing as needed
                              >
                                {basePath}
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant='outlined' sx={{ borderRadius: '12px' }}>
            <CardHeader title='Direcciones' />
            <CardContent
              sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <TransitionGroup
                style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}
              >
                {addresses.map((address, index) => (
                  <CSSTransition key={index} timeout={300} classNames='fade'>
                    <div style={{ flex: '1 1 500px' }}>
                      <Card raised sx={{ borderRadius: '12px' }}>
                        <CardHeader title={`Dirección ${index + 1}`} />
                        <CardContent>
                          <Grid container spacing={2}>
                            <CompanyAddressComponent
                              address={address}
                              onChange={(newData: AddressData) =>
                                handleAddressChange(index, newData)
                              }
                            />
                          </Grid>
                        </CardContent>
                      </Card>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
              <Box display='flex' gap={2} justifyContent='end'>
                {addresses.length > 0 && (
                  <Button
                    type='button'
                    variant='contained'
                    color='primary'
                    onClick={removeAddressComponent}
                  >
                    Remover Dirección
                  </Button>
                )}
                <Button
                  type='button'
                  variant='contained'
                  color='primary'
                  onClick={addAddressComponent}
                >
                  Agregar Dirección
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display='flex' gap={2} justifyContent='end'>
        <Button type='submit' variant='contained' color='primary'>
          Crear
        </Button>
      </Box>
    </form>
  );
};

export default CompanyForm;
