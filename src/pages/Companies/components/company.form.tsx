import { FC, useState } from 'react';
import { Grid, TextField, Button, Card, CardHeader, CardContent, Box, Fade } from '@mui/material';
import CompanyAddressComponent, { AddressData } from './company.address.component';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../companies.form.styles.scss';

export interface FormData {
    name: string;
    type: string;
    nit: string;
    addresses: AddressData[];
}

interface CompanyFormProperties {
    handleSubmit: (formData: FormData) => void;
}

const CompanyForm: FC<CompanyFormProperties> = ({ handleSubmit }) => {
    const [companyInfo, setCompanyInfo] = useState({ name: '', type: '', nit: '' });
    const [addresses, setAddresses] = useState<AddressData[]>([{ nomenclature: '', region: '', city: '', country: '' }]);

    const handleCompanyInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyInfo({ ...companyInfo, [event.target.name]: event.target.value });
    };

    const handleAddressChange = (index: number, newData: AddressData) => {
        setAddresses(prevAddresses => {
            const updatedAddresses = [...prevAddresses];
            updatedAddresses[index] = newData;
            return updatedAddresses;
        });
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { name, type, nit } = companyInfo
        handleSubmit({ name, type, nit, addresses });
    };

    const addAddressComponent = () => {
        setAddresses(prevAddresses => [...prevAddresses, { nomenclature: '', region: '', city: '', country: '' }]);
    };

    const removeAddressComponent = () => {
        setAddresses(prevAddresses => prevAddresses.slice(0, -1));
    };

    return (
        <form onSubmit={handleFormSubmit} style={{ width: '100%', display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card raised sx={{ borderRadius: '12px' }}>
                <CardHeader title='Informacion' />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='name'
                                label="Nombre"
                                variant="outlined"
                                fullWidth
                                value={companyInfo.name}
                                onChange={handleCompanyInfoChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='type'
                                label="Tipo"
                                variant="outlined"
                                fullWidth
                                value={companyInfo.type}
                                onChange={handleCompanyInfoChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='nit'
                                label="NIT"
                                variant="outlined"
                                fullWidth
                                value={companyInfo.nit}
                                onChange={handleCompanyInfoChange}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Rendering address components based on the count */}
            <Card variant='outlined' sx={{ borderRadius: '12px' }}>
                <CardHeader title='Direcciones' />
                <CardContent>
                    <TransitionGroup style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {addresses.map((address, index) => (
                            <CSSTransition key={index} timeout={300} classNames='fade'>
                                <div style={{ flex: '1 1 500px' }}>
                                    <Card raised sx={{ borderRadius: '12px' }}>
                                        <CardHeader title={`Dirección ${index + 1}`} />
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <CompanyAddressComponent
                                                    address={address}
                                                    onChange={(newData: AddressData) => handleAddressChange(index, newData)}
                                                />
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </CardContent>
            </Card>

            <Box display="flex" gap={2} justifyContent="end">
                {addresses.length > 1 && <Button type="button" variant="contained" color="primary" onClick={removeAddressComponent}>
                    Remover Dirección
                </Button>}
                <Button type="button" variant="contained" color="primary" onClick={addAddressComponent}>
                    Agregar Dirección
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Crear
                </Button>
            </Box>

        </form>
    );
};

export default CompanyForm;
