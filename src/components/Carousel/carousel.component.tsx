// CarouselComponent.tsx
import React from 'react';
import { Box, IconButton, styled, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CarouselComponentProps {
  images: string[];
  width?: string;
}

const StyledSlider = styled(Slider)({
  '.slick-list': {
    borderRadius: '16px', // Adjust radius as needed
    overflow: 'hidden',
  },
});

const CarouselComponent: React.FC<CarouselComponentProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const sliderRef = React.useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex: number, newIndex: number) =>
      setCurrentSlide(newIndex),
    arrows: false,
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <Box position='relative' width='100%' margin='auto'>
      <Box position='relative' width='100%'>
        {/* Carousel with images */}
        <StyledSlider
          ref={sliderRef}
          {...settings}
          style={{ maxWidth: '100%' }}
        >
          {images.map((src, index) => (
            <Box key={index} sx={{ outline: 'none' }}>
              <Box
                component='img'
                src={src}
                alt={`Product image ${index + 1}`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                }}
              />
            </Box>
          ))}
        </StyledSlider>
        {/* Custom Navigation with Slide Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '18px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 2,
            px: 2,
            py: 0.5,
          }}
        >
          <IconButton
            onClick={handlePrev}
            aria-label='Previous'
            sx={{ color: 'white', p: 0.5 }}
          >
            &lt;
          </IconButton>
          <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
            {`${currentSlide + 1} / ${images.length}`}
          </Typography>
          <IconButton
            onClick={handleNext}
            aria-label='Next'
            sx={{ color: 'white', p: 0.5 }}
          >
            &gt;
          </IconButton>
        </Box>
      </Box>

      {/* Thumbnails */}
      <Box display='flex' justifyContent='center' mt={2} gap={1}>
        {images.map((src, index) => (
          <Box
            key={index}
            component='img'
            src={src}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => sliderRef.current?.slickGoTo(index)}
            sx={{
              width: 50,
              height: 50,
              cursor: 'pointer',
              borderRadius: 1,
              border:
                currentSlide === index
                  ? '2px solid green'
                  : '2px solid transparent',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CarouselComponent;
