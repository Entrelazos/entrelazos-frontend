import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  IconButton,
  Skeleton,
  Typography,
  Container,
  Breadcrumbs,
  Link,
  Alert,
  Chip,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Error as ErrorIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import SimpleCarousel from '../../components/Carousel/SimpleCarousel.component';
import ProductCard from './components/ProductCard';
import ErrorBoundary from '../../components/ErrorBoundary';
import { getSingleProduct } from '../../services/products/productsService';
import { getFilesByEntityIdAndType } from '../../services/upload/uploadService';
import { ProductItem } from '../../types/products/ProductsTypes';
import { RootState } from '../../store/store';
import { getErrorMessage } from '../../utils/errorHandler';

// Constants
const CAROUSEL_HEIGHT = 400;
const SKELETON_ANIMATION = 'wave' as const;

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  <Container maxWidth='lg'>
    <Box p={2}>
      <Skeleton variant='text' width={300} height={32} sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        <Skeleton
          variant='rectangular'
          width='100%'
          height={CAROUSEL_HEIGHT}
          animation={SKELETON_ANIMATION}
          sx={{ borderRadius: 2 }}
        />
        <Box>
          <Skeleton variant='text' width='80%' height={40} sx={{ mb: 1 }} />
          <Skeleton variant='text' width='60%' height={32} sx={{ mb: 2 }} />
          <Skeleton variant='text' width='100%' height={20} sx={{ mb: 1 }} />
          <Skeleton variant='text' width='100%' height={20} sx={{ mb: 1 }} />
          <Skeleton variant='text' width='70%' height={20} sx={{ mb: 3 }} />
          <Skeleton variant='rectangular' width='100%' height={120} />
        </Box>
      </Box>
    </Box>
  </Container>
);

// Error State Component
const ErrorState: React.FC<{
  error: string;
  onRetry: () => void;
  onGoBack: () => void;
}> = ({ error, onRetry, onGoBack }) => (
  <Container maxWidth='lg'>
    <Box p={2}>
      <Alert
        severity='error'
        icon={<ErrorIcon />}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              aria-label='Reintentar'
              color='inherit'
              size='small'
              onClick={onRetry}
            >
              Reintentar
            </IconButton>
            <IconButton
              aria-label='Volver'
              color='inherit'
              size='small'
              onClick={onGoBack}
            >
              Volver
            </IconButton>
          </Box>
        }
        sx={{ mb: 2 }}
      >
        <Typography variant='body1'>{error}</Typography>
      </Alert>
    </Box>
  </Container>
);

// Breadcrumbs Component
const ProductBreadcrumbs: React.FC<{
  productName?: string;
  companyName?: string;
  companyId?: number;
  onCompanyClick?: () => void;
}> = ({ productName, companyName, companyId, onCompanyClick }) => (
  <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
    <Link
      underline='hover'
      color='inherit'
      href='/'
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <HomeIcon sx={{ mr: 0.5 }} fontSize='inherit' />
      Inicio
    </Link>
    <Link underline='hover' color='inherit' href='/productos'>
      Productos y Servicios
    </Link>
    {companyName && (
      <Link
        component='button'
        variant='inherit'
        onClick={onCompanyClick}
        underline='hover'
        color='inherit'
        sx={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          font: 'inherit',
        }}
      >
        {companyName}
      </Link>
    )}
    {productName && <Typography color='text.primary'>{productName}</Typography>}
  </Breadcrumbs>
);

// Floating Actions Component
const FloatingActions: React.FC<{
  onEdit?: () => void;
  onShare: () => void;
  onBack: () => void;
  showEdit: boolean;
}> = ({ onEdit, onShare, onBack, showEdit }) => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      zIndex: 1000,
    }}
  >
    <Tooltip title='Volver' placement='left'>
      <Fab
        size='medium'
        color='default'
        onClick={onBack}
        aria-label='Volver a la página anterior'
      >
        <ArrowBackIcon />
      </Fab>
    </Tooltip>

    <Tooltip title='Compartir' placement='left'>
      <Fab
        size='medium'
        color='primary'
        onClick={onShare}
        aria-label='Compartir producto'
      >
        <ShareIcon />
      </Fab>
    </Tooltip>

    {showEdit && onEdit && (
      <Tooltip title='Editar producto' placement='left'>
        <Fab
          size='medium'
          color='secondary'
          onClick={onEdit}
          aria-label='Editar este producto'
        >
          <EditIcon />
        </Fab>
      </Tooltip>
    )}
  </Box>
);

// No Image Placeholder Component
const NoImagePlaceholder: React.FC<{ productName: string }> = ({
  productName,
}) => (
  <Box
    sx={{
      width: '100%',
      height: CAROUSEL_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2,
      border: '2px dashed',
      borderColor: 'grey.300',
    }}
  >
    <Typography variant='h6' color='text.secondary' gutterBottom>
      Sin imágenes disponibles
    </Typography>
    <Typography variant='body2' color='text.secondary'>
      para {productName}
    </Typography>
  </Box>
);

// Main Component
const ProductPage: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { userCompaniesData } = useSelector(
    (state: RootState) => state.companies
  );

  // Simple state management
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Check if user owns this product's company
  const isMyCompany = useMemo(() => {
    if (!product || !userCompaniesData?.items) return false;
    return userCompaniesData.items.some(
      (company) => company.id === product.company.id
    );
  }, [product, userCompaniesData]);

  // Event handlers
  const handleEditClick = useCallback(() => {
    if (product) {
      navigate(`/productos/editar/${product.id}`);
    }
  }, [navigate, product]);

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleCompanyClick = useCallback(() => {
    if (product) {
      navigate(`/empresas/perfil-compania/${product.company.name}`);
    }
  }, [navigate, product]);

  const handleShareClick = useCallback(async () => {
    if (!product) return;

    const shareData = {
      title: product.product_name,
      text: `Mira este producto: ${product.product_name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('No se pudo compartir el producto');
    }
  }, [product]);

  // Effect to load data
  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        setLoading(false);
        setError('ID del producto no proporcionado');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setImageError(false);

        const productData = await getSingleProduct(productId);

        if (!productData) {
          setLoading(false);
          setError('Producto no encontrado');
          return;
        }

        setProduct(productData);

        // Load images
        try {
          const productImages = await getFilesByEntityIdAndType(
            productData.id,
            'product'
          );

          const imageUrls = productImages.map(
            (image: { url: string }) =>
              `${import.meta.env.VITE_BASE_FILES_URL}${image.url}`
          );

          setImages(imageUrls);
          setImageError(imageUrls.length === 0);
        } catch (imageError) {
          console.warn('Failed to load product images:', imageError);
          setImageError(true);
        }

        setLoading(false);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Error fetching product:', error);
        setLoading(false);
        setError(errorMessage);
        toast.error(`Error al cargar el producto: ${errorMessage}`);
      }
    };

    fetchData();
  }, [productId]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setImageError(false);
    // Trigger re-render by changing productId dependency
    if (productId) {
      const fetchData = async () => {
        try {
          const productData = await getSingleProduct(productId);
          if (!productData) {
            setError('Producto no encontrado');
            setLoading(false);
            return;
          }
          setProduct(productData);

          try {
            const productImages = await getFilesByEntityIdAndType(
              productData.id,
              'product'
            );
            const imageUrls = productImages.map(
              (image: { url: string }) =>
                `${import.meta.env.VITE_BASE_FILES_URL}${image.url}`
            );
            setImages(imageUrls);
            setImageError(imageUrls.length === 0);
          } catch (imageError) {
            console.warn('Failed to load product images:', imageError);
            setImageError(true);
          }
          setLoading(false);
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          setError(errorMessage);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [productId]);

  // Set document title for SEO
  useEffect(() => {
    if (product) {
      document.title = `${product.product_name} - ${product.company.name}`;

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute('content', product.product_description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = product.product_description;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    }

    return () => {
      document.title = 'Interlazos';
    };
  }, [product]);

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={handleRetry}
        onGoBack={handleBackClick}
      />
    );
  }

  // No product found
  if (!product) {
    return (
      <ErrorState
        error='Producto no encontrado'
        onRetry={handleRetry}
        onGoBack={handleBackClick}
      />
    );
  }

  return (
    <>
      <Container maxWidth='lg'>
        <Box p={2}>
          {/* Breadcrumbs */}
          <ProductBreadcrumbs
            productName={product.product_name}
            companyName={product.company.name}
            companyId={product.company.id}
            onCompanyClick={handleCompanyClick}
          />

          {/* Main Content */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Image Section */}
            <Box>
              {images.length > 0 ? (
                <ErrorBoundary
                  fallback={
                    <Box>
                      <Typography variant='h6' gutterBottom>
                        Imágenes del producto
                      </Typography>
                      {images.map((src, index) => (
                        <Box
                          key={index}
                          component='img'
                          src={src}
                          alt={`Product image ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            mb: 2,
                            maxHeight: 400,
                            objectFit: 'contain',
                          }}
                        />
                      ))}
                    </Box>
                  }
                >
                  <SimpleCarousel images={images} width='100%' />
                </ErrorBoundary>
              ) : (
                <NoImagePlaceholder productName={product.product_name} />
              )}

              {imageError && (
                <Alert severity='warning' sx={{ mt: 2 }}>
                  <Typography variant='body2'>
                    No se pudieron cargar algunas imágenes del producto
                  </Typography>
                </Alert>
              )}
            </Box>

            {/* Product Information */}
            <Box>
              <ProductCard product={product} />

              {/* Company Information */}
              <Box sx={{ mt: 3, p: 2, borderRadius: 2 }}>
                <Typography variant='h6' gutterBottom>
                  Información de la empresa
                </Typography>
                <Link
                  component='button'
                  variant='body1'
                  color='primary'
                  onClick={handleCompanyClick}
                  underline='hover'
                  sx={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                    fontWeight: 'medium',
                    mb: 1,
                    display: 'block',
                  }}
                >
                  {product.company.name}
                </Link>
                {product.company.description && (
                  <Typography variant='body2' color='text.secondary'>
                    {product.company.description}
                  </Typography>
                )}
              </Box>

              {/* Ownership indicator */}
              {isMyCompany && (
                <Chip
                  label='Tu producto'
                  color='success'
                  size='small'
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Floating Action Buttons */}
      <FloatingActions
        onEdit={isMyCompany ? handleEditClick : undefined}
        onShare={handleShareClick}
        onBack={handleBackClick}
        showEdit={isMyCompany}
      />
    </>
  );
};

export default ProductPage;
