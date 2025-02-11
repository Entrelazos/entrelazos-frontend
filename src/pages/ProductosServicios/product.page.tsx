import { Box, Skeleton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { FC, useEffect, useState } from 'react';
import CarouselComponent from '../../components/Carousel/carousel.component';
import { getSingleProduct } from '../../services/products/productsService';
import { useParams } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { ProductItem } from '../../types/products/ProductsTypes';
import { getFilesByEntityIdAndType } from '../../services/upload/uploadService';

const ProductPage: FC = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndImages = async () => {
      if (!productId) return;

      try {
        setLoading(true); // Start loading

        const productData = await getSingleProduct(productId);
        setProduct((prev) =>
          prev?.id !== productData.id ? productData : prev
        );

        if (productData?.id) {
          const productImages = await getFilesByEntityIdAndType(
            productData.id,
            'product'
          );
          const imageUrls = productImages.map(
            (image: { url: string }) =>
              `${import.meta.env.VITE_BASE_FILES_URL}${image.url}`
          );
          setImages((prev) =>
            JSON.stringify(prev) !== JSON.stringify(imageUrls)
              ? imageUrls
              : prev
          );
        }
      } catch (error) {
        console.error('Error fetching product or images:', error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchProductAndImages();
  }, [productId]);

  return (
    <Box width='100%' maxWidth='100%' mx='auto' p={2}>
      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={6} lg={6} display='flex' justifyContent='center'>
          <Box width='100%'>
            {loading ? (
              <Skeleton variant='rectangular' width='100%' height={400} />
            ) : images.length > 0 ? (
              <CarouselComponent images={images} width='100%' />
            ) : null}
          </Box>
        </Grid2>
        <Grid2 xs={12} md={6} lg={6}>
          {loading ? (
            <Skeleton variant='rectangular' width='100%' height={300} />
          ) : (
            product && <ProductCard product={product} />
          )}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ProductPage;
