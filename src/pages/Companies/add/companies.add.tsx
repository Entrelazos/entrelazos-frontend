import { Box, Container, Typography, Alert } from '@mui/material';
import { FC, useState, useCallback } from 'react';
import CompanyForm, { FormData } from '../components/company.form';
import { createCompany } from '../../../services/companies/companyService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Business } from '@mui/icons-material';

const AddCompanies: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (formData: FormData): Promise<void> => {
      setError(null);

      try {
        const createdCompany = await createCompany(formData);

        if (createdCompany) {
          toast.success('Empresa creada exitosamente!');
          navigate(`/empresas/perfil-compania/${createdCompany.name}`);
        } else {
          throw new Error('No se pudo crear la empresa');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Error desconocido al crear la empresa';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [navigate]
  );

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Page Header */}
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
          <Business fontSize='large' color='primary' />
          Registrar Nueva Empresa
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          Complete el formulario para registrar una nueva empresa en el sistema.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <CompanyForm handleSubmit={handleSubmit} />
    </Container>
  );
};

export default AddCompanies;
