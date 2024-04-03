import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCategories } from '../../../store/categories/categoriesThunks';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchProductsByCategoryId } from '../../../store/products/productsThunks';
import { ProductItem } from '../../../types/products/ProductsTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ReactCountryFlag from 'react-country-flag';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', width: 70, flex: 1 },
  { field: 'price', headerName: 'Precio', flex: 1 },
  { field: 'isApproved', headerName: 'Aprobado', flex: 1 },
  { field: 'isPublic', headerName: 'Publico', flex: 1 },
  { field: 'isService', headerName: 'Servicio', flex: 1 },
];

const ProductsByCategory: FC = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductsByCategoryId(parseInt(productId)));
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

    const rows = items[0].products.map(
      (product: ProductItem, index: number) => ({
        id: index + 1,
        name: product.product_name,
        price: product.price,
        isApproved: product.is_approved,
        isPublic: product.is_public,
        isService: product.is_service,
      })
    );
    return (
      <>
        <h2>{items[0].category_name}</h2>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                page: meta.currentPage,
                pageSize: meta.itemsPerPage,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </>
    );
  }
};
export default ProductsByCategory;
