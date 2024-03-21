import {
  Avatar,
  Box,
  ListItemText,
  Paper,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  styled,
} from '@mui/material';
import { FC, useState } from 'react';
import { PROFILE_TABS } from '../../constants/constants';
import CustomTabPanelComponent from './components/custom.tab.panel.component';

const StyledTabs = styled(Tabs)(() => ({
  '& .MuiTabs-flexContainer': {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ProfilePage: FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Paper
        square={false}
        elevation={0}
        sx={{
          height: '290px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
        }}
      >
        <Box
          borderRadius='1rem'
          position='relative'
          height='100%'
          color='rgb(255, 255, 255)'
          sx={{
            background:
              'linear-gradient(rgba(0, 75, 80, 0.8), rgba(0, 75, 80, 0.8)) center center / cover no-repeat, url("https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg")',
            backgroundPosition: 'center center',
          }}
          overflow='hidden'
        >
          <Stack
            position='absolute'
            left={24}
            bottom={24}
            zIndex={10}
            flexDirection='row'
            alignItems='center'
            gap={4}
          >
            <Avatar
              alt='Felipe Marin'
              src='/src/assets/avatar_25.jpg'
              sx={{ width: '128px', height: '128px' }}
            />
            <ListItemText>
              <Typography fontSize='1.5rem'>Felipe Marin</Typography>
              <Typography
                fontSize='0.825rem'
                sx={{ opacity: 0.48 }}
                marginTop={0.5}
              >
                Company CEO
              </Typography>
            </ListItemText>
          </Stack>
        </Box>
        <StyledTabs
          centered
          sx={{
            overflow: 'hidden',
            minHeight: '48px',
            display: 'flex',
            width: '100%',
            bottom: '0px',
            zIndex: 9,
            position: 'absolute',
            backgroundColor: 'rgb(33, 43, 54)',
            justifyContent: 'flex-end',
          }}
          onChange={handleChange}
          value={value}
        >
          {PROFILE_TABS.map(({ icon, label, id }, index) => (
            <Tab
              icon={<SvgIcon component={icon} />}
              label={label}
              key={id}
              iconPosition='start'
              sx={{ fontSize: 'small', minHeight: '48px' }}
              {...a11yProps(index)}
            />
          ))}
        </StyledTabs>
      </Paper>
      {PROFILE_TABS.map(({ label }, index) => (
        <CustomTabPanelComponent index={index} value={value} key={index}>
          {label}
        </CustomTabPanelComponent>
      ))}
    </Box>
  );
};

export default ProfilePage;
