import { Box, IconButton, Skeleton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import CarouselComponent from '../../components/Carousel/carousel.component';
import { getSingleProduct } from '../../services/products/productsService';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { ProductItem } from '../../types/products/ProductsTypes';
import { getFilesByEntityIdAndType } from '../../services/upload/uploadService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import EditIcon from '@mui/icons-material/Edit';

const ProductPage: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { userCompaniesData } = useSelector(
    (state: RootState) => state.companies
  );

  const isMyCompany = useMemo(() => {
    if (!product || !userCompaniesData?.items) return false;
    return userCompaniesData.items.some(
      (company) => company.id === product.company.id
    );
  }, [product, userCompaniesData]);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [productData] = await Promise.all([getSingleProduct(productId)]);

        if (productData) {
          setProduct(productData);

          const productImages = await getFilesByEntityIdAndType(
            productData.id,
            'product'
          );
          const imageUrls = productImages.map(
            (image: { url: string }) =>
              `${import.meta.env.VITE_BASE_FILES_URL}${image.url}`
          );
          setImages(imageUrls);
        }
      } catch (error) {
        console.error('Error fetching product or images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleEditClick = useCallback(() => {
    if (product) {
      navigate(`/productos/editar/${product.id}`);
    }
  }, [navigate, product]);

  const carouselSection = loading ? (
    <Skeleton variant='rectangular' width='100%' height={400} />
  ) : images.length > 0 ? (
    <CarouselComponent images={images} width='100%' />
  ) : null;

  const productSection = loading ? (
    <Skeleton variant='rectangular' width='100%' height={300} />
  ) : product ? (
    <ProductCard product={product} />
  ) : null;

  return (
    <Box width='100%' maxWidth='100%' mx='auto' p={2}>
      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={6} display='flex' justifyContent='center'>
          <Box width='100%' position='relative'>
            {isMyCompany && (
              <IconButton
                aria-label='edit'
                onClick={handleEditClick}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
              >
                <EditIcon />
              </IconButton>
            )}
            {carouselSection}
          </Box>
        </Grid2>

        <Grid2 xs={12} md={6}>
          {productSection}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ProductPage;
