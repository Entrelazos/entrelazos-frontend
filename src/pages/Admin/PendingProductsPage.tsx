import { FC, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Grid,
  Box,
  TablePagination,
} from '@mui/material';
import {
  getProductsByStatus,
  updateProductStatus,
} from '../../services/products/productsService';
import { ApprovalStatus, approvalStatusMap } from '../../constants/constants';
import { ProductItem } from '../../types/products/ProductsTypes';

const PendingProducts: FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchPendingProducts();
  }, [paginationModel.page, paginationModel.pageSize]);

  const fetchPendingProducts = async () => {
    try {
      const response = await getProductsByStatus(ApprovalStatus.PENDING, {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
      setProducts(response.items);
      setTotalItems(response.meta.totalItems);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleSelect = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const updateApprovalStatus = async (status: ApprovalStatus) => {
    if (selectedProducts.length === 0) {
      alert('Select at least one product to update.');
      return;
    }

    setLoading(true);
    try {
      updateProductStatus(selectedProducts, status);
      alert(`Products marked as ${status}.`);
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth='800px' margin='auto' padding={3}>
      <Typography variant='h4' gutterBottom>
        Productos Pendientes
      </Typography>

      {products?.length === 0 ? (
        <Typography color='textSecondary'>
          No hay productos pendientes.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {products?.map((product) => (
            <Grid item xs={12} key={product.id}>
              <Card variant='outlined'>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelect(product.id)}
                    />
                    <Box>
                      <Typography variant='h6'>
                        {product.product_name}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {product.company.name} • ${product.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant='body2'
                    sx={{ color: 'orange', fontWeight: 'bold' }}
                  >
                    {approvalStatusMap[product.approval_status]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {products?.length > 0 && (
        <>
          <Box display='flex' justifyContent='center' gap={2} mt={3}>
            <Button
              variant='contained'
              color='success'
              onClick={() => updateApprovalStatus(ApprovalStatus.APPROVED)}
              disabled={loading || !selectedProducts.length}
            >
              Aprobar Seleccionados
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={() => updateApprovalStatus(ApprovalStatus.REJECTED)}
              disabled={loading || !selectedProducts.length}
            >
              Rechazar Seleccionados
            </Button>
          </Box>
          <TablePagination
            component='div'
            count={totalItems}
            page={paginationModel.page}
            rowsPerPage={paginationModel.pageSize}
            onPageChange={(_, newPage) =>
              setPaginationModel({ ...paginationModel, page: newPage })
            }
            onRowsPerPageChange={(event) =>
              setPaginationModel({
                ...paginationModel,
                pageSize: parseInt(event.target.value, 10),
              })
            }
          />
        </>
      )}
    </Box>
  );
};

export default PendingProducts;
