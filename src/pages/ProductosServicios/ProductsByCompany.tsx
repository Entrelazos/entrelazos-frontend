import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductsByCompanyId } from '../../store/products/productsSlice';
import {
  CreateProductType,
  ProductItem,
} from '../../types/products/ProductsTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import { clearProductsData } from '../../store/products/productsSlice';
import { AddOutlined, MoreVert } from '@mui/icons-material';
import { isMyCompany } from '../../store/companies/companiesSlice';
import Grid2 from '@mui/material/Unstable_Grid2';
import AddProductModal from './components/AddProductModal';
import { createProducts } from '../../services/products/productsService';

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
  const compayIsMine = useSelector(isMyCompany());

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOpenCloseModal = (openState: boolean) => {
    setOpenModal(openState);
  };

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
      <AddProductModal
        companyId={parseInt(selectedCompanyId)}
        open={openModal}
        handleClose={(event: MouseEvent, reason: string) => {
          if (reason === 'backdropClick') {
            event.stopPropagation();
            return;
          }
          handleOpenCloseModal(false);
        }}
        onSubmit={(data: CreateProductType[]) => {
          createProducts(data);
        }}
      ></AddProductModal>
      {!isEmbedded && <h2>{items[0]?.name}</h2>}
      <Card raised sx={{ borderRadius: '12px' }}>
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
                    onClick={() => {
                      handleOpenCloseModal(true);
                    }}
                  >
                    <Typography>Agregar Productos</Typography>
                  </Button>
                </Grid2>
              )
            }
          />
        )}
        {(rows && Boolean(rows.length)) ?? (
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
        )}
      </Card>
    </>
  );
  // }
};
export default ProductsByCompany;
