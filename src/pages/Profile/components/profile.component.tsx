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
  Twitter,
  WhatsApp,
} from '@mui/icons-material';
import { CompanyItem } from '../../../types/companies/CompaniesTypes';

const ProfileComponent: FC<CompanyItem> = ({
  id,
  name,
  type,
  nit,
  description,
  addresses,
  products,
  category_name,
  social,
}) => {
  const renderSocial = (key: string, value: string) => {
    console.log('====================================');
    console.log(key);
    console.log('====================================');

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
        IconComponent = Twitter;
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
    <Grid2 container>
      <Grid2 xs={12} md={4}>
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
                  <Typography>{social.email}</Typography>
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
    </Grid2>
  );
};

export default ProfileComponent;
