import { Box } from '@mui/material';
import { FC } from 'react';
import CompanyForm, { FormData } from '../components/company.form';
import { createCompany } from '../../../services/companies/companyService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCompanies: FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData: FormData) => {
    const createdCompany = await createCompany(formData);
    if (createdCompany) {
      navigate(`/empresas/perfil-compania/${createdCompany.name}`);
      toast.success('Empresa creada exitosamente!');
    } else {
      toast.error('Error al crear la empresa.');
    }
  };

  return (
    <Box display='flex' gap={2} justifyContent='center'>
      <CompanyForm handleSubmit={handleSubmit} />
    </Box>
  );
};

export default AddCompanies;
