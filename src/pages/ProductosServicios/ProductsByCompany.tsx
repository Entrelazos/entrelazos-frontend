import {
  FC,
  useEffect,
  useState,
  MouseEvent,
  useMemo,
  useCallback,
} from 'react';
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
import Grid2 from '@mui/material/Unstable_Grid2';
import AddProductModal from './components/AddProductModal';
import { createProducts } from '../../services/products/productsService';
import { clearProductsData } from '../../store/products/productsSliceFinal';
import { ApprovalStatus, approvalStatusMap } from '../../constants/constants';

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
  const { data, loading } = byCompany;

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [openModal, setOpenModal] = useState(false);

  const totalItems = data?.meta?.totalItems ?? 0;
  const items = useMemo(
    () =>
      data?.items.filter(
        (item) => item.approval_status === ApprovalStatus.APPROVED
      ) ?? [],
    [data]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'dbId', headerName: 'Id', width: 100 },
      { field: 'name', headerName: 'Nombre', width: 150 },
      { field: 'price', headerName: 'Precio', width: 150 },
      { field: 'approvalStatus', headerName: 'Estado', width: 150 },
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
        approvalStatus: approvalStatusMap[product.approval_status],
        isPublic: product.is_public,
        isService: product.is_service,
        company: companyData?.name || 'N/A',
      })),
    [items, companyData]
  );

  const loadProducts = useCallback(() => {
    dispatch(
      fetchProductsByCompanyId({
        companyId: selectedCompanyId,
        options: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      })
    );
  }, [
    dispatch,
    selectedCompanyId,
    paginationModel.page,
    paginationModel.pageSize,
  ]);

  useEffect(() => {
    if (selectedCompanyId) loadProducts();
    return () => {
      dispatch(clearProductsData());
    };
  }, [selectedCompanyId, loadProducts, dispatch]);

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
    await createProducts(products);
    loadProducts();
  };

  return (
    <>
      <AddProductModal
        companyId={selectedCompanyId}
        open={openModal}
        handleClose={(event: MouseEvent, reason: string) => {
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

      <Card raised sx={{ borderRadius: '12px', width: '100%' }}>
        {isEmbedded && (
          <CardHeader
            title='Productos'
            titleTypographyProps={{ fontSize: '1.125rem', fontWeight: 700 }}
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
