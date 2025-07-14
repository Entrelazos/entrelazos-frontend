import React from 'react';
import { Typography, Stack, Card, CardContent } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface SimpleDataCardProperties {
  title?: string;
  mainText?: string;
  subtitle?: string;
  Icon?: SvgIconComponent;
}

const SimpleDataCard: React.FC<SimpleDataCardProperties> = ({
  title,
  mainText,
  subtitle,
  Icon,
}) => {
  return (
    <Card raised sx={{ borderRadius: '12px' }}>
      <CardContent>
        {title && <Typography variant='subtitle2'>{title}</Typography>}
        <Stack
          direction='row'
          alignItems='center'
          marginTop={2}
          marginBottom={1}
          gap={0.5}
        >
          {Icon && <Icon fontSize='small' />}
          <Typography variant='subtitle2' lineHeight='initial'>
            {subtitle}
          </Typography>
        </Stack>
        <Typography
          variant='h3'
          sx={{ fontSize: { sm: '1.625rem', md: '1.875rem', lg: '2rem' } }}
          fontWeight={700}
        >
          {mainText}{' '}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SimpleDataCard;
