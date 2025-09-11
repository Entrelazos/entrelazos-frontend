import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export const Copyright = React.memo(
  (props: React.ComponentProps<typeof Typography>) => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
      <Typography
        variant='body2'
        color='text.secondary'
        align='center'
        {...props}
      >
        {'Copyright © '}
        <Link color='inherit' href='#' onClick={(e) => e.preventDefault()}>
          INTERLAZOS
        </Link>{' '}
        {currentYear}
        {'.'}
      </Typography>
    );
  }
);

Copyright.displayName = 'Copyright';
