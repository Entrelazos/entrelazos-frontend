import React, { FC, useState } from 'react';
import { Grid, TextField, Button, Typography, Card, CardHeader, CardContent } from '@mui/material';
import CountrySelector from '../../../components/CountrySelect';
import CompanyAddressComponent from './company.address.component';

interface CompanyFormProperties {
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
}

const CompanyForm: FC<CompanyFormProperties> = ({ handleSubmit }) => {
    const [addressComponents, setAddressComponents] = useState<number>(1); // Initial count of address components

    const addAddressComponent = () => {
        setAddressComponents(prevCount => prevCount + 1);
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card raised sx={{ borderRadius: '12px' }} >
                <CardHeader title="Informacion de la Empresa" />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='name'
                                label="Nombre"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='type'
                                label="Tipo"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='nit'
                                label="NIT"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Rendering address components based on the count */}
            {[...Array(addressComponents)].map((_, index) => (
                <Card key={index} raised sx={{ borderRadius: '12px', marginTop: '20px' }}>
                    <CardHeader title={`Dirección ${index + 1}`} />
                    <CardContent>
                        <Grid container spacing={2}>
                            <CompanyAddressComponent />
                        </Grid>
                    </CardContent>
                </Card>
            ))}

            <Grid item xs={12} style={{ marginTop: '16px' }}>
                <Button type="button" variant="contained" color="primary" onClick={addAddressComponent}>
                    Agregar Dirección
                </Button>
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
