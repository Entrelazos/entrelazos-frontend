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
import { FC, useEffect, useState } from 'react';
import { PROFILE_TABS } from '../../constants/constants';
import CustomTabPanelComponent from './components/custom.tab.panel.component';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCompanyByName } from '../../store/companies/companiesThunks';
import { isMyCompany } from '../../store/companies/companiesSlice';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import {
  getFileByEntityIdAndType,
  uploadFile,
} from '../../services/upload/uploadService';

interface ProfilePageProperties {
  isCompany: boolean;
}

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

const ProfilePage: FC<ProfilePageProperties> = ({ isCompany }) => {
  const { companyName } = useParams();
  const compayIsMine = useSelector(isMyCompany());
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState(0);
  const [imageData, setImageData] = useState();
  const userOrCompany = isCompany ? 'company' : 'user';

  const { data, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleImageUpload = async (file: File) => {
    const imageAlt = isCompany
      ? 'Imagen de perfil de compañia'
      : 'Imagen de perfil de usuario';
    return await uploadFile({
      altText: imageAlt,
      description: imageAlt,
      file,
      entityId: data.id,
      entityType: isCompany ? 'company' : 'user',
      imageType: isCompany ? 'company_profile' : 'user_profile',
    });
  };

  useEffect(() => {
    const fetchImage = async () => {
      const avatarImg = await getFileByEntityIdAndType(data?.id, userOrCompany);
      setImageData(avatarImg);
    };
    fetchImage();
  }, [data]);

  if (isCompany) {
    useEffect(() => {
      dispatch(fetchCompanyByName(companyName));
    }, [dispatch]);
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  if (data) {
    return (
      <Box display='flex' flexDirection='column' gap={3}>
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
              <Box>
                {compayIsMine ? (
                  <ImageUpload
                    imageSrc='/src/assets/avatar_25.jpg'
                    handleImageUpload={handleImageUpload}
                  />
                ) : (
                  <Avatar
                    alt='Felipe Marin'
                    src='/src/assets/avatar_25.jpg'
                    sx={{ width: '128px', height: '128px' }}
                  />
                )}
              </Box>
              <ListItemText>
                <Typography fontSize='1.5rem'>{data.name}</Typography>
                {!isCompany && (
                  <Typography
                    fontSize='0.825rem'
                    sx={{ opacity: 0.48 }}
                    marginTop={0.5}
                  >
                    Company CEO
                  </Typography>
                )}
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
        {PROFILE_TABS.map(({ component: Component }, index) => (
          <CustomTabPanelComponent index={index} value={value} key={index}>
            <Component {...data} />
          </CustomTabPanelComponent>
        ))}
      </Box>
    );
  }
  return;
};

export default ProfilePage;
