import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

interface SimpleCarouselProps {
  images: string[];
  width?: string;
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  console.log('SimpleCarousel rendered with images:', images);

  if (!images || images.length === 0) {
    console.log('SimpleCarousel: No images provided');
    return null;
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <Box position='relative' width='100%' margin='auto'>
      {/* Main Image Display */}
      <Box
        position='relative'
        width='100%'
        sx={{
          height: 400,
          overflow: 'hidden',
          borderRadius: 2,
          backgroundColor: 'grey.800',
        }}
      >
        {imageErrors.has(currentSlide) ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.900',
            }}
          >
            <Typography color='text.secondary'>
              Error cargando imagen
            </Typography>
          </Box>
        ) : (
          <Box
            component='img'
            src={images[currentSlide]}
            alt={`Product image ${currentSlide + 1}`}
            onError={() => handleImageError(currentSlide)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        )}

        {/* Slide Indicator */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 2,
              px: 2,
              py: 0.5,
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
              {`${currentSlide + 1} / ${images.length}`}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box display='flex' justifyContent='center' mt={2} gap={1}>
          {images.map((src, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 50,
                height: 50,
                cursor: 'pointer',
                borderRadius: 1,
                border:
                  currentSlide === index
                    ? '2px solid primary.main'
                    : '2px solid transparent',
                overflow: 'hidden',
                opacity: currentSlide === index ? 1 : 0.7,
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              {imageErrors.has(index) ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.200',
                  }}
                >
                  <Typography variant='caption' color='text.secondary'>
                    !
                  </Typography>
                </Box>
              ) : (
                <Box
                  component='img'
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  onError={() => handleImageError(index)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SimpleCarousel;
