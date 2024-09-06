import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsByCompanyId } from '../../store/products/productsThunks';
import { ProductItem } from '../../types/products/ProductsTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader } from '@mui/material';
import { clearProductsData } from '../../store/products/productsSlice';

interface ProductsByCompanyProps {
  companyIdParam?: string;
  isEmbedded?: boolean;
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', width: 70, flex: 1 },
  { field: 'price', headerName: 'Precio', flex: 1 },
  { field: 'isApproved', headerName: 'Aprobado', flex: 1 },
  { field: 'isPublic', headerName: 'Publico', flex: 1 },
  { field: 'isService', headerName: 'Servicio', flex: 1 },
  { field: 'company', headerName: 'Empresa', flex: 1 },
];

const ProductsByCompany: FC<ProductsByCompanyProps> = ({
  companyIdParam,
  isEmbedded,
}) => {
  const { companyId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const selectedCompanyId = companyIdParam ?? companyId;

  const { items, meta } = data || {
    items: [],
    meta: { currentPage: 1, itemsPerPage: 10 },
  };

  const rows = items[0]?.products?.map(
    (product: ProductItem, index: number) => ({
      id: index + 1,
      name: product.product_name,
      price: product.price,
      isApproved: product.is_approved,
      isPublic: product.is_public,
      isService: product.is_service,
      company: items[0].name,
    })
  );

  const [rowCountState, setRowCountState] = useState(meta?.totalItems || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      meta?.totalItems !== undefined ? meta?.totalItems - 1 : prevRowCountState
    );
  }, [meta?.totalItems, setRowCountState]);

  useEffect(() => {
    dispatch(
      fetchProductsByCompanyId({
        companyId: parseInt(selectedCompanyId),
        options: {
          page: paginationModel.page === 0 ? 1 : paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      })
    );
    return () => {
      dispatch(clearProductsData());
    };
  }, [paginationModel]);
  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newPaginationModel);
  };
  return (
    <>
      {!isEmbedded && <h2>{items[0]?.name}</h2>}
      <Card raised sx={{ borderRadius: '12px' }}>
        {isEmbedded && (
          <CardHeader
            title='Productos'
            titleTypographyProps={{
              fontSize: '1.125rem',
              fontWeight: '700',
            }}
          />
        )}
        <CardContent>
          <DataGrid
            rows={rows ?? []}
            columns={columns}
            rowCount={rowCountState}
            loading={loading}
            paginationMode='server'
            onPaginationModelChange={handlePaginationModelChange}
            paginationModel={paginationModel}
            pageSizeOptions={[5, 10]}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'black',
                opacity: 0.5,
              },
            }}
          />
        </CardContent>
      </Card>
    </>
  );
  // }
};
export default ProductsByCompany;
