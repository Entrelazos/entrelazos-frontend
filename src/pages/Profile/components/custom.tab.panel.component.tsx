import { Box, Typography } from '@mui/material';
import { FC } from 'react';

interface TabPanelProperties {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanelComponent: FC<TabPanelProperties> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default CustomTabPanelComponent;
