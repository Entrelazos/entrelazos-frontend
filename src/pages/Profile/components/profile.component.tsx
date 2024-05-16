import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
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
} from '@mui/icons-material';

const ProfileComponent: FC = () => {
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
                  <Place></Place>
                  <Typography>Medellin, Colombia</Typography>
                </Stack>
                <Stack direction='row' spacing={1.5}>
                  <Email></Email>
                  <Typography>felipe@gmail.com</Typography>
                </Stack>
                <Stack direction='row' spacing={1.5}>
                  <Smartphone></Smartphone>
                  <Typography>+573012547896</Typography>
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
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <Facebook />
                  <Typography variant='subtitle2'>
                    <Link href=''>https://www.facebook.com/entrelazos</Link>
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <Instagram />
                  <Typography variant='subtitle2'>
                    <Link href=''>
                      https://www.instagram.com/caitlyn.kerluke
                    </Link>
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <LinkedIn />
                  <Typography variant='subtitle2'>
                    <Link href=''>
                      https://www.linkedin.com/in/caitlyn.kerluke
                    </Link>
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <Twitter />
                  <Typography variant='subtitle2'>
                    <Link href=''>https://www.twitter.com/caitlyn.kerluke</Link>
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Grid2>
    </Grid2>
  );
};

export default ProfileComponent;
