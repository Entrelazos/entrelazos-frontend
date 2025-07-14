import { FC, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Rating,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { ProductItem } from '../../../types/products/ProductsTypes';
import parse from 'html-react-parser';

interface ProductCardProperties {
  product: ProductItem;
}

const ProductCard: FC<ProductCardProperties> = ({ product }) => {
  const [size, setSize] = useState<number>(9);
  const [quantity, setQuantity] = useState<number>(0);
  const isOutOfStock = true; // Based on availability (Available: 0)

  return (
    <Box
      sx={{
        maxWidth: 400,
        bgcolor: '#121212',
        color: '#fff',
        p: 3,
        borderRadius: 2,
      }}
    >
      {/* <Typography color='error' fontWeight='bold'>
        OUT OF STOCK
      </Typography> */}

      <Typography variant='h6' fontWeight='bold' mt={1}>
        {product.product_name}
      </Typography>

      {/* <Grid container alignItems='center' spacing={1}>
        <Grid item>
          <Rating value={4} readOnly size='small' />
        </Grid>
        <Grid item>
          <Typography variant='body2'>(1.95k reviews)</Typography>
        </Grid>
      </Grid> */}

      {/* <Typography
        mt={1}
        color='grey.500'
        sx={{ textDecoration: 'line-through' }}
      >
        ${product.price}
      </Typography> */}
      <Typography variant='h6' fontWeight='bold'>
        ${product.price}
      </Typography>

      <Box mt={1} fontSize='14px' color='grey.400'>
        {parse(product.product_description)}
      </Box>

      {/* <Typography mt={2} fontWeight='bold'>
        Color
      </Typography>
      <Chip label='✔' color='error' sx={{ mt: 1, fontSize: 18 }} />

      <Typography mt={2} fontWeight='bold'>
        Size
      </Typography>
      <Select
        value={size}
        onChange={(e) => setSize(e.target.value as number)}
        size='small'
        sx={{ mt: 1, bgcolor: '#333', color: '#fff' }}
      >
        {[7, 8, 9, 10, 11].map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select> */}

      {/* <Typography mt={2} fontWeight='bold'>
        Quantity
      </Typography>
      <Box display='flex' alignItems='center' mt={1}>
        <IconButton size='small' disabled={quantity <= 0}>
          <RemoveIcon />
        </IconButton>
        <Typography mx={2}>{quantity}</Typography>
        <IconButton size='small'>
          <AddIcon />
        </IconButton>
        <Typography ml={2} color='grey.500'>
          Available: 0
        </Typography>
      </Box> */}

      {/* <Grid container spacing={1} mt={2}>
        <Grid item size={{ xs: 6 }}>
          <Button
            variant='contained'
            fullWidth
            disabled={isOutOfStock}
            sx={{ bgcolor: 'grey.700' }}
          >
            Add to cart
          </Button>
        </Grid>
        <Grid item size={{ xs: 6 }}>
          <Button
            variant='contained'
            fullWidth
            disabled={isOutOfStock}
            sx={{ bgcolor: 'grey.700' }}
          >
            Buy now
          </Button>
        </Grid>
      </Grid> */}

      {/* <Grid container justifyContent='space-between' mt={2}>
        <Button startIcon={<FavoriteBorderIcon />} sx={{ color: 'grey.400' }}>
          Favorite
        </Button>
        <Button startIcon={<ShareIcon />} sx={{ color: 'grey.400' }}>
          Share
        </Button>
      </Grid> */}
    </Box>
  );
};

export default ProductCard;
