import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import {
  Place,
  Email,
  Smartphone,
  Facebook,
  Instagram,
  LinkedIn,
  WhatsApp,
} from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import { CompanyItem } from '../../../types/companies/CompaniesTypes';
import ProductsByCompany from '../../ProductosServicios/ProductsByCompany';

const ProfileComponent: FC<CompanyItem> = ({
  id,
  name,
  nit,
  description,
  addresses,
  products,
  social,
}) => {
  const renderSocial = (key: string, value: string) => {
    let IconComponent;

    switch (key) {
      case 'facebook':
        IconComponent = Facebook;
        break;
      case 'instagram':
        IconComponent = Instagram;
        break;
      case 'linkedin':
        IconComponent = LinkedIn;
        break;
      case 'x':
        IconComponent = XIcon;
        break;
      default:
        return null;
    }

    return (
      <Stack direction='row' spacing={1.5} alignItems='center' key={key}>
        <IconComponent />
        <Typography variant='subtitle2'>
          <Link href={`//${value}`} target='_blank'>
            {value}
          </Link>
        </Typography>
      </Stack>
    );
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} md={6}>
        <Stack direction='column' spacing={3}>
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader
              title='Acerca'
              titleTypographyProps={{
                fontSize: '1.125rem',
                fontWeight: '700',
              }}
            />
            <CardContent>
              <Box display='flex' flexDirection='column' gap={2}>
                <Stack direction='row' spacing={1.5}>
                  <Typography>{description}</Typography>
                </Stack>
                {addresses.map(
                  (
                    {
                      nomenclature,
                      city: {
                        name,
                        region: {
                          name: regionName,
                          country: { name: countryName },
                        },
                      },
                    },
                    index
                  ) => (
                    <Stack direction='row' spacing={1.5} key={index}>
                      <Place />
                      <Typography>
                        {nomenclature}, {name}, {regionName}, {countryName}
                      </Typography>
                    </Stack>
                  )
                )}

                <Stack direction='row' spacing={1.5}>
                  <Email></Email>
                  <Link href={`mailto:${social.email}`} underline='none'>
                    <Typography>{social.email}</Typography>
                  </Link>
                </Stack>
                <Stack direction='row' spacing={1.5}>
                  <Smartphone></Smartphone>
                  <Typography>{social.phone_number}</Typography>
                </Stack>
                <Stack direction='row' spacing={1.5}>
                  <WhatsApp></WhatsApp>
                  <Typography>{social.whatsapp}</Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
          <Card raised sx={{ borderRadius: '12px' }}>
            <CardHeader
              title='Social'
              titleTypographyProps={{
                fontSize: '1.125rem',
                fontWeight: '700',
              }}
            />
            <CardContent>
              <Box display='flex' flexDirection='column' gap={2}>
                {Object.entries(social).map(([key, socialN]) =>
                  renderSocial(key, socialN)
                )}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Grid2>
      <Grid2 xs={12} md={6}>
        <ProductsByCompany isEmbedded companyIdParam={id.toString()} />
      </Grid2>
    </Grid2>
  );
};

export default ProfileComponent;
