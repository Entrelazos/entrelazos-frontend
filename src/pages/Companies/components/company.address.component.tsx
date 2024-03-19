import { Grid, TextField } from "@mui/material";
import { FC } from "react";
import CountrySelector from "../../../components/CountrySelect";

const CompanyAddressComponent: FC = () => (
    <>
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
    </>
)
export default CompanyAddressComponent;