import { FC, useEffect, useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsByCompanyId } from '../../store/products/productsThunks';
import {
  CreateProductType,
  ProductItem,
} from '../../types/products/ProductsTypes';
import { DataGrid, GridColDef, GridOverlay } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { clearProductsData } from '../../store/products/productsSlice';
import { AddOutlined } from '@mui/icons-material';
import { isMyCompany } from '../../store/companies/companiesSlice';
import Grid2 from '@mui/material/Unstable_Grid2';
import AddProductModal from './components/AddProductModal';
import { createProducts } from '../../services/products/productsService';

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
  const compayIsMine = useSelector(isMyCompany());
  const { byCompany, loading } = useSelector(
    (state: RootState) => state.products
  );
  const { data: companyData } = useSelector(
    (state: RootState) => state.company
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [openModal, setOpenModal] = useState(false);

  const selectedCompanyId = companyIdParam ?? companyId;
  const items = byCompany?.items || [];
  const totalItems = byCompany?.meta?.totalItems || 0;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 100 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'price', headerName: 'Precio', width: 150 },
    { field: 'isApproved', headerName: 'Aprobado', width: 150 },
    { field: 'isPublic', headerName: 'Publico', width: 150 },
    { field: 'isService', headerName: 'Servicio', width: 150 },
    ...(isEmbedded
      ? []
      : [{ field: 'company', headerName: 'Empresa', flex: 1 }]), // Conditionally include company column
  ];

  const rows = items.map((product: ProductItem, index: number) => ({
    id: index + 1,
    name: product.product_name,
    price: product.price,
    isApproved: product.is_approved,
    isPublic: product.is_public,
    isService: product.is_service,
    company: companyData.name || 'N/A', // Assuming you have company_name in the product data
  }));

  useEffect(() => {
    dispatch(
      fetchProductsByCompanyId({
        companyId: parseInt(selectedCompanyId),
        options: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      })
    );

    return () => {
      dispatch(clearProductsData());
    };
  }, [paginationModel, dispatch, selectedCompanyId]);

  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    console.log('====================================');
    console.log(newPaginationModel);
    console.log('====================================');
    setPaginationModel(newPaginationModel);
  };

  return (
    <>
      <AddProductModal
        companyId={parseInt(selectedCompanyId)}
        open={openModal}
        handleClose={(event: MouseEvent, reason: string) => {
          if (reason !== 'backdropClick') {
            setOpenModal(false);
          }
        }}
        onSubmit={(data: CreateProductType[]) => {
          createProducts(data);
        }}
      />
      {!isEmbedded && <h2>test</h2>}
      <Card raised sx={{ borderRadius: '12px', width: '100%' }}>
        {isEmbedded && (
          <CardHeader
            title='Productos'
            titleTypographyProps={{
              fontSize: '1.125rem',
              fontWeight: '700',
            }}
            action={
              compayIsMine && (
                <Grid2 display='flex' alignItems='center' padding={0}>
                  <Button
                    variant='outlined'
                    startIcon={<AddOutlined />}
                    onClick={() => setOpenModal(true)}
                  >
                    <Typography>Agregar Productos</Typography>
                  </Button>
                </Grid2>
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
              onPaginationModelChange={handlePaginationModelChange}
              paginationModel={paginationModel}
              pageSizeOptions={[5, 10]}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'black',
                  opacity: 0.5,
                },
              }}
              slots={{ noRowsOverlay: NoRowsOverlay }}
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductsByCompany;
