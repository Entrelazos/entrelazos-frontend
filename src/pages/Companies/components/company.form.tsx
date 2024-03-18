import React, { FC } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import CountrySelector from '../../../components/CountrySelect';

interface CompanyFormProperties {
    handleSubmit: React.FormEventHandler<HTMLFormElement>
}

const CompanyForm: FC<CompanyFormProperties> = ({ handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Typography variant="h6">Informacion de la Empresa</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name='name'
                        label="Nombre"
                        variant="outlined"
                        fullWidth
                    // Add onChange and value props if needed
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name='type'
                        label="Tipo"
                        variant="outlined"
                        fullWidth
                    // Add onChange and value props if needed
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name='nit'
                        label="NIT"
                        variant="outlined"
                        fullWidth
                    // Add onChange and value props if needed
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" style={{ marginTop: '16px' }}>Direccion</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name='nomenclature'
                        label="Direccion"
                        variant="outlined"
                        fullWidth
                    // Add onChange and value props if needed
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CountrySelector />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name='region'
                        label="Region"
                        variant="outlined"
                        fullWidth
                    // Add onChange and value props if needed
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name='city'
                        label="Ciudad"
                        variant="outlined"
                        fullWidth
                    // Add onChange and value props if needed
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} style={{ marginTop: '16px' }}>
                <Button type="submit" variant="contained" color="primary">
                    Crear
                </Button>
            </Grid>
        </form>
    );
};

export default CompanyForm;
