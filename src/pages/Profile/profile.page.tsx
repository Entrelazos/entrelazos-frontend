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
import { uploadFile } from '../../services/upload/uploadService';
import { FileResponseType, imageType } from '../../types/uploads/uploadTypes';
import ImageUploadV2 from '../../components/ImageUpload/ImageUploadV2';
import { getErrorMessage } from '../../utils/errorHandler';
import EditCompanyForm from './components/EditCompanyForm';

interface ProfilePageProperties {
  isCompany: boolean;
}

interface ImageUploadProperties {
  file: File;
  imageType: imageType;
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
  const [profileImageData, setProfileImageData] = useState<
    FileResponseType | undefined
  >();
  const [bannerImageData, setBannerImageData] = useState<
    FileResponseType | undefined
  >();
  // TODO Implement user profile
  // const userOrCompany = isCompany ? 'company' : 'user';

  const { data, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  const { displayName } = useSelector((state: RootState) => state.auth);
  const safeDisplayName = displayName || 'Usuario';

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isCompany && companyName) {
      dispatch(fetchCompanyByName(companyName));
    }
  }, [isCompany, companyName, dispatch]);

  useEffect(() => {
    if (data?.images?.length) {
      setBannerImageData(data.images[0]);
      setProfileImageData(data.images[1]);
    } else {
      setBannerImageData(undefined);
      setProfileImageData(undefined);
    }
  }, [data]);

  const handleImageUpload = async ({
    file,
    imageType,
  }: ImageUploadProperties) => {
    const { id: entityId } = data || {};
    if (!entityId) return;

    try {
      const entityType = isCompany ? 'company' : 'user';
      const imageAlt = `Imagen de perfil de ${isCompany ? 'compañia' : 'usuario'}`;

      const savedImage = (await uploadFile({
        altText: imageAlt,
        description: imageAlt,
        file,
        entityId,
        entityType,
        imageType,
      })) as FileResponseType;

      // ✅ Use a mapping object to dynamically update state
      const updateState: Record<imageType, (data: FileResponseType) => void> = {
        company_banner: setBannerImageData,
        company_profile: setProfileImageData,
        user_profile: setProfileImageData, // Add missing mapping
      };

      const updateFunction = updateState[imageType];
      if (updateFunction) {
        updateFunction(savedImage);
      }
    } catch (error: unknown) {
      console.error(`❌ Error uploading ${imageType}:`, getErrorMessage(error));
      // You could show a toast notification here
    }
  };

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
          {compayIsMine && (
            <ImageUploadV2
              handleImageUpload={(file) =>
                handleImageUpload({ file, imageType: 'company_banner' })
              }
              inputId='upload-banner'
              position='absolute'
            />
          )}

          <Box
            borderRadius='1rem'
            position='relative'
            height='100%'
            color='rgb(255, 255, 255)'
            sx={{
              background: `linear-gradient(rgba(0, 75, 80, 0.5), rgba(0, 75, 80, 0.5)), url('${import.meta.env.VITE_BASE_FILES_URL}${bannerImageData?.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
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
                  <ImageUploadV2
                    inputId='upload-profile'
                    handleImageUpload={(file) =>
                      handleImageUpload({
                        file,
                        imageType: 'company_profile',
                      })
                    }
                    rounded
                  >
                    <Avatar
                      alt={safeDisplayName}
                      src={
                        profileImageData?.url
                          ? `${import.meta.env.VITE_BASE_FILES_URL}${profileImageData.url}`
                          : undefined
                      }
                      sx={{ width: '128px', height: '128px' }}
                    />
                  </ImageUploadV2>
                ) : (
                  <Avatar
                    alt={safeDisplayName}
                    src={
                      profileImageData?.url
                        ? `${import.meta.env.VITE_BASE_FILES_URL}${profileImageData.url}`
                        : undefined
                    }
                    sx={{ width: '128px', height: '128px' }}
                  />
                )}
              </Box>
              <ListItemText>
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Typography fontSize='1.5rem' fontWeight={700}>
                    {data.name}
                  </Typography>
                  {compayIsMine && (
                    <EditCompanyForm
                      company={data}
                      trigger={
                        <Box
                          sx={{
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                            },
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <SvgIcon sx={{ fontSize: 20, color: 'white' }}>
                            <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
                          </SvgIcon>
                        </Box>
                      }
                    />
                  )}
                </Stack>
                {!isCompany && (
                  <Typography
                    fontSize='1rem'
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
            <Component />
          </CustomTabPanelComponent>
        ))}
      </Box>
    );
  }

  return <Typography>No data available</Typography>;
};

export default ProfilePage;
