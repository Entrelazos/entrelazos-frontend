import { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Typography,
  Grid,
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
import ProductsByCompany from '../../ProductosServicios/ProductsByCompany';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const ProfileComponent: FC = () => {
  const company = useSelector((state: RootState) => state.company.data);

  if (!company) return null;

  const { id, description, addresses, social } = company;
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
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
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
                {addresses?.map(
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

                {social?.email && (
                  <Stack direction='row' spacing={1.5}>
                    <Email></Email>
                    <Link href={`mailto:${social.email}`} underline='none'>
                      <Typography>{social.email}</Typography>
                    </Link>
                  </Stack>
                )}
                {social?.phone_number && (
                  <Stack direction='row' spacing={1.5}>
                    <Smartphone></Smartphone>
                    <Typography>{social.phone_number}</Typography>
                  </Stack>
                )}
                {social?.whatsapp && (
                  <Stack direction='row' spacing={1.5}>
                    <WhatsApp></WhatsApp>
                    <Typography>{social.whatsapp}</Typography>
                  </Stack>
                )}
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
                {social &&
                  Object.entries(social).map(([key, socialN]) =>
                    renderSocial(key, socialN)
                  )}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProductsByCompany isEmbedded companyIdParam={id.toString()} />
      </Grid>
    </Grid>
  );
};

export default ProfileComponent;
