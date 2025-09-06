import { FC, useEffect, useState, MouseEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsByCompanyId } from '../../store/products/productsThunks';
import {
  CreateProductType,
  ProductItem,
} from '../../types/products/ProductsTypes';
import {
  DataGrid,
  GridColDef,
  GridOverlay,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { isMyCompany } from '../../store/companies/companiesSlice';
import Grid from '@mui/material/Grid';
import AddProductModal from './components/AddProductModal';
import { createProducts } from '../../services/products/productsService';
import { clearProductsData } from '../../store/products/productsSliceFinal';
import { toast } from 'react-toastify';

interface ProductsByCompanyProps {
  companyIdParam?: string;
  isEmbedded?: boolean;
}

const NoRowsOverlay = () => (
  <GridOverlay sx={{ height: 200 }}>
    <Typography variant='subtitle1'>No items to display</Typography>
  </GridOverlay>
);

const ProductsByCompany: FC<ProductsByCompanyProps> = ({
  companyIdParam,
  isEmbedded,
}) => {
  const { companyId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const selectedCompanyId = parseInt(companyIdParam ?? companyId ?? '0');
  const compayIsMine = useSelector(isMyCompany());
  const { byCompany } = useSelector((state: RootState) => state.products);
  const { data: companyData } = useSelector(
    (state: RootState) => state.company
  );
  const { data, loading, error } = byCompany;

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [openModal, setOpenModal] = useState(false);

  const items = data?.items ?? [];

  const totalItems = data?.meta?.totalItems ?? 0;

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'dbId', headerName: 'Id', width: 100 },
      { field: 'name', headerName: 'Nombre', width: 150 },
      { field: 'price', headerName: 'Precio', width: 150 },
      { field: 'isPublic', headerName: 'Publico', width: 150 },
      { field: 'isService', headerName: 'Servicio', width: 150 },
      ...(isEmbedded
        ? []
        : [{ field: 'company', headerName: 'Empresa', flex: 1 }]),
    ],
    [isEmbedded, companyData]
  );

  const rows = useMemo(
    () =>
      items.map((product: ProductItem, index: number) => ({
        id: index + 1,
        dbId: product.id,
        name: product.product_name,
        price: product.price,
        isPublic: product.is_public,
        isService: product.is_service,
        company: companyData?.name || 'N/A',
      })),
    [items, companyData]
  );

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(
        fetchProductsByCompanyId({
          companyId: selectedCompanyId,
          options: {
            page: paginationModel.page + 1, // Server expects 1-based pagination
            limit: paginationModel.pageSize,
          },
        })
      );
    }
  }, [
    dispatch,
    selectedCompanyId,
    paginationModel.page,
    paginationModel.pageSize,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearProductsData());
    };
  }, [dispatch]);

  const handlePaginationModelChange = (newModel: {
    page: number;
    pageSize: number;
  }) => {
    if (
      newModel.page !== paginationModel.page ||
      newModel.pageSize !== paginationModel.pageSize
    ) {
      setPaginationModel(newModel);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/productos/${params.row.dbId}`);
  };

  const handleModalSubmit = async (products: CreateProductType[]) => {
    try {
      await createProducts(products);

      // Reset to first page to see newly created products
      setPaginationModel((prev) => ({ ...prev, page: 0 }));

      // The useEffect will automatically reload data when page changes
      toast.success('Producto creado exitosamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setOpenModal(false);
    } catch (error) {
      console.error('Error creating products:', error);
      toast.error('Hubo un error creando el producto.');
    }
  };

  return (
    <>
      <AddProductModal
        companyId={selectedCompanyId}
        open={openModal}
        handleClose={(_event: MouseEvent, reason: string) => {
          if (reason !== 'backdropClick') {
            setOpenModal(false);
          }
        }}
        onSubmit={handleModalSubmit}
      />

      {!isEmbedded && (
        <Typography variant='h5' gutterBottom>
          Productos de la Empresa
        </Typography>
      )}

      {error && (
        <Typography color='error' variant='body2' sx={{ mb: 2 }}>
          Error loading products: {error}
        </Typography>
      )}

      <Card raised sx={{ borderRadius: '12px', width: '100%' }}>
        {isEmbedded && (
          <CardHeader
            title='Productos'
            slotProps={{
              title: { fontSize: '1.125rem', fontWeight: 700 },
            }}
            action={
              compayIsMine && (
                <Grid display='flex' alignItems='center' padding={0}>
                  <Button
                    variant='outlined'
                    startIcon={<AddOutlined />}
                    onClick={() => setOpenModal(true)}
                  >
                    <Typography>Agregar Productos</Typography>
                  </Button>
                </Grid>
              )
            }
          />
        )}

        <CardContent>
          <Box sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              rowCount={totalItems}
              loading={loading}
              paginationMode='server'
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              pageSizeOptions={[5, 10]}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'black',
                  opacity: 0.5,
                },
              }}
              slots={{ noRowsOverlay: NoRowsOverlay }}
              onRowClick={handleRowClick}
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductsByCompany;
