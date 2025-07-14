import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import CameraEnhance from '@mui/icons-material/CameraEnhance';

interface ImageUploadProperties {
  handleImageUpload?: (file: File) => any;
  children?: React.ReactNode;
  inputId: string;
  rounded?: boolean;
  position?: 'absolute' | 'relative';
}

const ImageUploadV2: FC<ImageUploadProperties> = ({
  handleImageUpload,
  children,
  inputId,
  rounded,
  position,
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && handleImageUpload) {
      await handleImageUpload(file);
    }
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      gap={2}
      role='presentation'
      tabIndex={0}
      position={position || 'initial'}
      width='100%'
      height='100%'
      zIndex={1}
      sx={{ cursor: 'pointer', zIndex: 1 }}
    >
      <input
        accept='image/*'
        type='file'
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={inputId}
      />
      <label htmlFor={inputId} style={{ width: '100%', height: '100%' }}>
        <Box
          display='flex'
          sx={{ position: 'relative' }}
          width='100%'
          height='100%'
        >
          {children}
          <Box
            display='flex'
            flexDirection='column'
            position='absolute'
            width='100%'
            height='100%'
            gap={2}
            top={0}
            left={0}
            sx={{
              cursor: 'pointer',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: rounded ? '50%' : 'initial',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <CameraEnhance fontSize='large' />
            <Typography variant='caption'>Actualizar Imagen</Typography>
          </Box>
        </Box>
      </label>
    </Box>
  );
};

export default ImageUploadV2;
