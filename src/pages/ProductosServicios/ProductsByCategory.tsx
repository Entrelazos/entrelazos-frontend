import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsByCategoryId } from '../../store/products/productsThunks';
import { ProductItem } from '../../types/products/ProductsTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Card,
  CardContent,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
} from '@mui/material';
import { clearProductsData } from '../../store/products/productsSlice';
import { Info } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', width: 70, flex: 1 },
  { field: 'price', headerName: 'Precio', flex: 1 },
  { field: 'isApproved', headerName: 'Aprobado', flex: 1 },
  { field: 'isPublic', headerName: 'Publico', flex: 1 },
  { field: 'isService', headerName: 'Servicio', flex: 1 },
  { field: 'company', headerName: 'Empresa', flex: 1 },
];

const ProductsByCategory: FC = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductsByCategoryId(parseInt(categoryId)));
    return () => {
      dispatch(clearProductsData());
    };
  }, [dispatch]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  if (data) {
    const { items, meta } = data || {
      items: [],
      meta: { currentPage: 1, itemsPerPage: 10 },
    };

    return (
      <ImageList cols={8}>
        {items[0]?.products?.map((item) => (
          <ImageListItem key={item.id}>
            <img
              srcSet={`https://picsum.photos/id/${item.id + 1}/200/300`}
              src={`https://picsum.photos/id/${item.id + 1}/200/300`}
              alt={item.product_name}
              loading='lazy'
            />
            <ImageListItemBar
              title={item.product_name}
              subtitle={item.company.name}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.product_name}`}
                >
                  <Info />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    );
  }
};
export default ProductsByCategory;
