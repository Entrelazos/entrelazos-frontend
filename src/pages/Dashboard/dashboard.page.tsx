import { FC, useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Business, Dashboard as DashboardIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCompanies } from '../../store/companies/companiesThunks';
import { AppDispatch, RootState } from '../../store/store';
import { CompanyItem } from '../../types/companies/CompaniesTypes';
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridPaginationModel,
} from '@mui/x-data-grid';
import ReactCountryFlag from 'react-country-flag';
import { Link, useNavigate } from 'react-router-dom';
import SimpleDataCard from '../../components/SimpleDataCard';

// Interfaces for component props
interface TransformedCompany {
  id: number;
  name: string;
  description: string;
  type: string;
  country: string;
}

interface CompaniesTableProps {
  companies: TransformedCompany[];
  loading: boolean;
  totalCount: number;
  paginationModel: GridPaginationModel;
  onPaginationChange: (paginationModel: GridPaginationModel) => void;
  onRowClick: (rowParams: GridRowParams) => void;
}

interface DashboardHeaderProps {
  totalCompanies: number;
}

interface LoadingStateProps {
  message?: string;
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

// Memoized column definition
const getColumns = (): GridColDef[] => [
  {
    field: 'name',
    headerName: 'Nombre de la Empresa',
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <Typography variant='body2' fontWeight={500}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'description',
    headerName: 'Descripción',
    flex: 1.5,
    minWidth: 250,
    renderCell: (params) => (
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {params.value || 'Sin descripción'}
      </Typography>
    ),
  },
  {
    field: 'country',
    headerName: 'País',
    flex: 0.5,
    minWidth: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Box display='flex' alignItems='center' justifyContent='center'>
        {params.value ? (
          <ReactCountryFlag
            countryCode={params.value}
            style={{
              fontSize: '1.5rem',
              lineHeight: '2em',
              borderRadius: '2px',
            }}
            title={params.value}
          />
        ) : (
          <Typography variant='caption' color='text.disabled'>
            N/A
          </Typography>
        )}
      </Box>
    ),
  },
  {
    field: 'type',
    headerName: 'Categoría',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Box
        sx={
          {
            px: 1,
            py: 0.5,
            borderRadius: 1,
            color: 'primary.600',
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'inline-block',
          } as any
        }
      >
        {params.value}
      </Box>
    ),
  },
];

// Memoized Dashboard Header Component
const DashboardHeader: FC<DashboardHeaderProps> = ({ totalCompanies }) => (
  <Box sx={{ mb: 4 }}>
    <Typography
      variant='h1'
      component='h1'
      sx={{
        fontSize: { xs: '1.75rem', md: '2.25rem' },
        fontWeight: 700,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <DashboardIcon fontSize='large' color='primary' />
      Panel de Control
    </Typography>
    <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
      Gestiona y supervisa todas tus empresas registradas desde un solo lugar.
    </Typography>
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <Typography variant='h6' color='text.secondary'>
        {totalCompanies > 0
          ? `Tienes ${totalCompanies} empresa${totalCompanies !== 1 ? 's' : ''} registrada${totalCompanies !== 1 ? 's' : ''}`
          : 'No tienes empresas registradas'}
      </Typography>
      <Button
        variant='contained'
        startIcon={<Add />}
        component={Link}
        to='/inscribir-empresas'
        size='large'
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Registrar Nueva Empresa
      </Button>
    </Box>
  </Box>
);

// Memoized Companies Table Component
const CompaniesTable: FC<CompaniesTableProps> = ({
  companies,
  loading,
  totalCount,
  paginationModel,
  onPaginationChange,
  onRowClick,
}) => {
  const columns = useMemo(() => getColumns(), []);

  return (
    <Card
      raised
      sx={
        {
          borderRadius: 3,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        } as any
      }
    >
      <CardHeader
        title='Mis Empresas'
        slotProps={{
          title: {
            sx: {
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'text.primary',
            },
          },
          subheader: {
            sx: {
              color: 'text.secondary',
            },
          },
        }}
        subheader={`${totalCount} empresa${totalCount !== 1 ? 's' : ''} registrada${totalCount !== 1 ? 's' : ''}`}
        sx={{ pb: 1 }}
      />
      <Box sx={{ px: 3, pb: 3 }}>
        <DataGrid
          rows={companies}
          columns={columns}
          rowCount={totalCount}
          loading={loading}
          paginationMode='server'
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationChange}
          onRowClick={onRowClick}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            minHeight: 400,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'grey.50',
              borderRadius: '8px 8px 0 0',
              fontSize: '0.875rem',
              fontWeight: 600,
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid',
              borderColor: 'divider',
            },
          }}
          aria-label='Tabla de empresas registradas'
          getRowId={(row) => row.id}
          localeText={{
            noRowsLabel: 'No se encontraron empresas',
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} filas seleccionadas`
                : `${count.toLocaleString()} fila seleccionada`,
          }}
        />
      </Box>
    </Card>
  );
};

// Memoized Loading State Component
const LoadingState: FC<LoadingStateProps> = ({ message = 'Cargando...' }) => (
  <Box
    display='flex'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    py={8}
    role='status'
    aria-live='polite'
  >
    <CircularProgress size={48} sx={{ mb: 2 }} />
    <Typography variant='h6' color='text.secondary'>
      {message}
    </Typography>
  </Box>
);

// Memoized Error State Component
const ErrorState: FC<ErrorStateProps> = ({ error, onRetry }) => (
  <Alert
    severity='error'
    sx={{ mb: 2 }}
    action={
      onRetry && (
        <Button color='inherit' size='small' onClick={onRetry}>
          Reintentar
        </Button>
      )
    }
  >
    <Typography variant='body2'>{error}</Typography>
  </Alert>
);

// Memoized Empty State Component
const EmptyState: FC = () => (
  <Box
    display='flex'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    py={8}
    textAlign='center'
  >
    <Business sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
    <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
      No tienes empresas registradas
    </Typography>
    <Typography
      variant='body2'
      color='text.disabled'
      sx={{ mb: 3, maxWidth: 400 }}
    >
      Comienza registrando tu primera empresa para acceder a todas las
      funcionalidades del sistema.
    </Typography>
    <Button
      variant='contained'
      startIcon={<Add />}
      component={Link}
      to='/inscribir-empresas'
      size='large'
    >
      Registrar Primera Empresa
    </Button>
  </Box>
);

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const { userCompaniesData, loading, error } = useSelector(
    (state: RootState) => state.companies
  );
  const { uid } = useSelector((state: RootState) => state.auth);

  // Local state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Memoized data transformations
  const { items = [], meta = { totalItems: 0 } } = userCompaniesData || {};

  const transformedCompanies = useMemo(
    () =>
      items.map(
        (company: CompanyItem): TransformedCompany => ({
          id: company.id,
          name: company.name || 'Sin nombre',
          description: company.description || '',
          type: company.categories?.[0]?.category_name || 'Sin categoría',
          country:
            company.addresses?.[0]?.city?.region?.country?.alpha_code || '',
        })
      ),
    [items]
  );

  // Memoized statistics
  const stats = useMemo(() => {
    const totalCompanies = meta.totalItems;
    const categoriesCount = new Set(
      items.map((company) => company.categories?.[0]?.category_name || 'Otro')
    ).size;
    const countriesCount = new Set(
      items
        .map(
          (company) => company.addresses?.[0]?.city?.region?.country?.alpha_code
        )
        .filter(Boolean)
    ).size;

    return {
      totalCompanies,
      categoriesCount,
      countriesCount,
    };
  }, [items, meta.totalItems]);

  // Memoized callbacks
  const handlePaginationChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
  }, []);

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      if (params.row.name) {
        navigate(
          `/empresas/perfil-compania/${encodeURIComponent(params.row.name)}`
        );
      }
    },
    [navigate]
  );

  const handleRetry = useCallback(() => {
    if (uid) {
      dispatch(
        fetchUserCompanies({
          userId: parseInt(uid),
          options: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
          },
        })
      );
    }
  }, [dispatch, uid, paginationModel]);

  // Effects
  useEffect(() => {
    if (uid) {
      dispatch(
        fetchUserCompanies({
          userId: parseInt(uid),
          options: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
          },
        })
      );
    }
  }, [paginationModel, dispatch, uid]);

  // Early returns for loading and error states
  if (loading && !userCompaniesData) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <LoadingState message='Cargando tu panel de control...' />
      </Container>
    );
  }

  if (error && !userCompaniesData) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <ErrorState error={error} onRetry={handleRetry} />
      </Container>
    );
  }

  const hasCompanies = transformedCompanies.length > 0;

  return (
    <Container maxWidth='xl' sx={{ py: 4 }} role='main'>
      {/* Dashboard Header */}
      <DashboardHeader totalCompanies={stats.totalCompanies} />

      {/* Error State */}
      {error && <ErrorState error={error} onRetry={handleRetry} />}

      {/* Statistics Cards */}
      {hasCompanies && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SimpleDataCard
              title='Total de Empresas'
              mainText={stats.totalCompanies.toString()}
              subtitle='Empresas registradas'
              Icon={Business}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SimpleDataCard
              title='Categorías'
              mainText={stats.categoriesCount.toString()}
              subtitle='Diferentes sectores'
              Icon={DashboardIcon}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SimpleDataCard
              title='Países'
              mainText={stats.countriesCount.toString()}
              subtitle='Presencia internacional'
              Icon={DashboardIcon}
            />
          </Grid>
        </Grid>
      )}

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          {hasCompanies ? (
            <CompaniesTable
              companies={transformedCompanies}
              loading={loading}
              totalCount={meta.totalItems}
              paginationModel={paginationModel}
              onPaginationChange={handlePaginationChange}
              onRowClick={handleRowClick}
            />
          ) : (
            <EmptyState />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
