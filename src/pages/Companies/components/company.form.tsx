import { FC, useState } from 'react';
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
} from '@mui/material';
import CompanyAddressComponent from './company.address.component';
import { AddressData } from '../../../types/address/AddressTypes';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../companies.form.styles.scss';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { SocialType } from '../../../types/social/SocialTypes';
import { SOCIAL_NETWORK_DATA } from '../../../constants/constants';
import { MuiTelInput } from 'mui-tel-input';

export interface FormData {
  name: string;
  type: string;
  nit: string;
  description: string;
  addresses: AddressData[];
  social: SocialType;
}

interface CompanyFormProperties {
  handleSubmit: (formData: FormData) => void;
}

const CompanyForm: FC<CompanyFormProperties> = ({ handleSubmit }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    type: '',
    nit: '',
    description: '',
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

  const handleSocialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSocial({ ...social, [event.target.name]: event.target.value });
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
    const { name, type, nit, description } = companyInfo;

    handleSubmit({ name, type, nit, description, addresses, social });
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
          <Grid2 container spacing={2}>
            <Grid2 xs={12} md={6}>
              <Stack direction='column' spacing={3}>
                <TextField
                  name='name'
                  label='Nombre'
                  variant='outlined'
                  fullWidth
                  value={companyInfo.name}
                  onChange={handleCompanyInfoChange}
                />
                <TextField
                  name='type'
                  label='Tipo'
                  variant='outlined'
                  fullWidth
                  value={companyInfo.type}
                  onChange={handleCompanyInfoChange}
                />
                <TextField
                  name='nit'
                  label='NIT'
                  variant='outlined'
                  fullWidth
                  value={companyInfo.nit}
                  onChange={handleCompanyInfoChange}
                />
              </Stack>
            </Grid2>
            <Grid2 xs={12} md={6}>
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
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={6}>
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader title='Redes Sociales' />
            <CardContent>
              <Stack direction='column' spacing={3}>
                {SOCIAL_NETWORK_DATA.map(
                  ({ name, label, icon: Icon, fieldType }) =>
                    name === 'phone_number' || name === 'whatsapp' ? (
                      <MuiTelInput
                        defaultCountry='CO'
                        margin='normal'
                        fullWidth
                        key={name}
                        label={label}
                        name={name}
                        autoComplete={name}
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
                        onChange={handleSocialChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={6}>
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
        </Grid2>
      </Grid2>

      <Box display='flex' gap={2} justifyContent='end'>
        <Button type='submit' variant='contained' color='primary'>
          Crear
        </Button>
      </Box>
    </form>
  );
};

export default CompanyForm;
