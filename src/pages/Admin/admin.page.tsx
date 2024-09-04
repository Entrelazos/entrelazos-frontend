import { Add } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { hasRole } from '../../store/auth';

const AdminPage: FC = () => {
  const isAdmin = useSelector(hasRole('admin'));

  return (
    isAdmin && (
      <Box>
        <Box display='flex' marginBottom={4}>
          <Button
            variant='contained'
            startIcon={<Add />}
            component={Link}
            to='/admin/agregar'
          >
            Añadir una empresa
          </Button>
        </Box>
      </Box>
    )
  );
};

export default AdminPage;
