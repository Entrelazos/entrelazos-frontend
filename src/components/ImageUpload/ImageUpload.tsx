import React, { FC, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CameraEnhance from '@mui/icons-material/CameraEnhance';

interface ImageUploadProperties {
  imageSrc: string;
  handleImageUpload?: (file: File) => any;
}

const ImageUpload: FC<ImageUploadProperties> = ({
  imageSrc,
  handleImageUpload,
}) => {
  const [image, setImage] = useState(imageSrc);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && handleImageUpload) {
      const imageData = await handleImageUpload(file);
      setImage(import.meta.env.VITE_BASE_FILES_URL + imageData.url);
    }
  };

  useEffect(() => {
    setImage(imageSrc);
  }, [imageSrc]);

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      gap={2}
      role='presentation'
      tabIndex={0}
      sx={{ cursor: 'pointer' }}
    >
      <input
        accept='image/*'
        type='file'
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id='upload-input'
      />
      <label htmlFor='upload-input'>
        <Box display='flex' sx={{ position: 'relative' }}>
          <img
            src={image}
            alt='avatar'
            style={{
              width: 150,
              height: 150,
              objectFit: 'cover',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          />
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
              borderRadius: '50%',
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

export default ImageUpload;
