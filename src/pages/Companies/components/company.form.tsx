import { FC, useState } from 'react';
import { Grid, TextField, Button, Card, CardHeader, CardContent } from '@mui/material';
import CompanyAddressComponent, { AddressData } from './company.address.component';

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
        console.log('====================================');
        console.log(newData);
        console.log('====================================');
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

    return (
        <form onSubmit={handleFormSubmit}>
            <Card raised>
                {/* Company information fields */}
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
            {addresses.map((address, index) => (
                <Card key={index} raised sx={{ borderRadius: '12px', marginTop: '20px' }}>
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
            ))}

            <Button type="button" variant="contained" color="primary" onClick={addAddressComponent}>
                Agregar Dirección
            </Button>

            <Button type="submit" variant="contained" color="primary">
                Crear
            </Button>
        </form>
    );
};

export default CompanyForm;
