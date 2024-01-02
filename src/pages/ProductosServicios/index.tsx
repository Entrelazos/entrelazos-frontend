import { ImageListItem, ImageListItemBar, IconButton, Grid } from '@mui/material';
import { Hero } from './components/Hero';
import { HomeContainer } from './styles';
import InfoIcon from '@mui/icons-material/Info';
import { CATEGORIES } from '../../constants/constants';

export function ProductosServicios() {
  return (
    <HomeContainer>
      <Hero />
      <Grid container spacing={2} padding={2} gap={4} width='100%' margin={0} justifyContent='center'>
        {CATEGORIES.map((item) => (
          <Grid key={item.image} xs={4} sm={3} md={2} lg={1}>
            <ImageListItem
              key={item.image}
            >
              <img
                srcSet={`../../assets/categories-icons/${item.image}`}
                src={`../../assets/categories-icons/${item.image}`}
                alt={item.name}
                loading="lazy"
              />
              <ImageListItemBar
                title={item.name}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`info about ${item.name}`}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          </Grid>
        ))}
      </Grid>
    </HomeContainer>
  );
}
