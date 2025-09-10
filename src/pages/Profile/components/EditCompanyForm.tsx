import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stack,
  Typography,
  Divider,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CompanyAddressComponent from '../../Companies/components/company.address.component';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { updateCompanyData } from '../../../store/companies/companiesThunks';
import { CompanyItem } from '../../../types/companies/CompaniesTypes';
import { SocialType } from '../../../types/social/SocialTypes';
import { AddressData } from '../../../types/address/AddressTypes';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../utils/errorHandler';

interface EditCompanyFormProps {
  company: CompanyItem;
  trigger?: React.ReactNode;
}

interface CompanyFormData {
  name: string;
  nit: string;
  description: string;
  social: SocialType;
  addresses: AddressData[];
}

const EditCompanyForm: React.FC<EditCompanyFormProps> = ({ 
  company,
  trigger 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company.name,
    nit: company.nit,
    description: company.description,
    social: { ...company.social },
    addresses: (company.addresses || []).map(addr => ({
      nomenclature: addr.nomenclature,
      city: addr.city.id.toString(),
      region: addr.city.region.id.toString(),
      country: addr.city.region.country.id.toString(),
    })),
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        nit: company.nit,
        description: company.description,
        social: { ...company.social },
        addresses: (company.addresses || []).map(addr => ({
          nomenclature: addr.nomenclature,
          city: addr.city.id.toString(),
          region: addr.city.region.id.toString(),
          country: addr.city.region.country.id.toString(),
        })),
      });
    }
  }, [company]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form data when closing
    setFormData({
      name: company.name,
      nit: company.nit,
      description: company.description,
      social: { ...company.social },
      addresses: (company.addresses || []).map(addr => ({
        nomenclature: addr.nomenclature,
        city: addr.city.id.toString(),
        region: addr.city.region.id.toString(),
        country: addr.city.region.country.id.toString(),
      })),
    });
  };

  const handleChange = (field: keyof CompanyFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSocialChange = (field: keyof SocialType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: event.target.value,
      },
    }));
  };

  const handleAddressChange = (index: number, newAddressData: AddressData) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((address, i) => 
        i === index 
          ? newAddressData
          : address
      ),
    }));
  };

  const addAddress = () => {
    const newAddress: AddressData = {
      nomenclature: '',
      city: '',
      region: '',
      country: '',
    };
    
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  const removeAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      await dispatch(updateCompanyData({
        companyId: company.id,
        formData: {
          name: formData.name,
          nit: formData.nit,
          description: formData.description,
          social: formData.social,
          addresses: formData.addresses,
        }
      })).unwrap();
      
      toast.success('Empresa actualizada exitosamente');
      handleClose();
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="outlined"
      startIcon={<EditIcon />}
      onClick={handleOpen}
      sx={{ borderRadius: 2 }}
    >
      Editar Empresa
    </Button>
  );

  return (
    <>
      {trigger ? (
        <Box onClick={handleOpen}>{trigger}</Box>
      ) : (
        defaultTrigger
      )}

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              Editar Empresa
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Información Básica
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre de la Empresa"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="NIT"
                  value={formData.nit}
                  onChange={handleChange('nit')}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={handleChange('description')}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>

              {/* Contact Information */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Información de Contacto
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.social.email || ''}
                  onChange={handleSocialChange('email')}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.social.phone_number || ''}
                  onChange={handleSocialChange('phone_number')}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="WhatsApp"
                  value={formData.social.whatsapp || ''}
                  onChange={handleSocialChange('whatsapp')}
                  variant="outlined"
                />
              </Grid>

              {/* Social Networks */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Redes Sociales
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={formData.social.facebook || ''}
                  onChange={handleSocialChange('facebook')}
                  variant="outlined"
                  placeholder="https://facebook.com/tu-empresa"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={formData.social.instagram || ''}
                  onChange={handleSocialChange('instagram')}
                  variant="outlined"
                  placeholder="https://instagram.com/tu-empresa"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={formData.social.linkedin || ''}
                  onChange={handleSocialChange('linkedin')}
                  variant="outlined"
                  placeholder="https://linkedin.com/company/tu-empresa"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="X (Twitter)"
                  value={formData.social.x || ''}
                  onChange={handleSocialChange('x')}
                  variant="outlined"
                  placeholder="https://x.com/tu-empresa"
                />
              </Grid>

              {/* Address Information */}
              <Grid size={{ xs: 12 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Direcciones
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addAddress}
                    variant="outlined"
                    size="small"
                  >
                    Agregar Dirección
                  </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {formData.addresses.map((address, index) => (
                <React.Fragment key={index}>
                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Dirección {index + 1}
                      </Typography>
                      {formData.addresses.length > 1 && (
                        <IconButton 
                          onClick={() => removeAddress(index)} 
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Grid>

                  <CompanyAddressComponent
                    address={address}
                    onChange={(newAddressData) => handleAddressChange(index, newAddressData)}
                  />

                  {index < formData.addresses.length - 1 && (
                    <Grid size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={loading}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default EditCompanyForm;