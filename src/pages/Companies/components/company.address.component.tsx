import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import CountrySelector from "../../../components/CountrySelect";
import { fetchRegions } from "../../../store/geo/geoThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";

export interface AddressData {
    nomenclature: string;
    region: string;
    city: string;
    country: string;
}

interface CompanyAddressComponentProps {
    address: AddressData;
    onChange: (newData: AddressData) => void;
}

const CompanyAddressComponent: FC<CompanyAddressComponentProps> = ({ address, onChange }) => {
    const [selectedRegion, setSelectedRegion] = useState<string>(address.region || '');

    const handleChange = (event: SelectChangeEvent<string>) => {
        const region = event.target.value;
        setSelectedRegion(region);
        if (onChange) {
            onChange({ ...address, region: region });
        }
    };

    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector(
        (state: RootState) => state.regions
    );

    useEffect(() => {
        if (address.country) {
            dispatch(fetchRegions(parseInt(address.country)));
        }
    }, [address.country]);

    const regionOptions = useMemo(() => {
        return data?.map((region) => (
            <MenuItem key={region.id} value={region.code} sx={{ display: "flex" }}>
                <Box display="flex" alignItems="center">
                    <Typography fontSize={13}>{region.name}</Typography>
                </Box>
            </MenuItem>
        ));
    }, [data]);

    return (
        <>
            <Grid item xs={12} sm={6}>
                <TextField
                    name='nomenclature'
                    label="Direccion"
                    variant="outlined"
                    fullWidth
                    value={address.nomenclature}
                    onChange={e => onChange({ ...address, nomenclature: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CountrySelector
                    value={address.country}
                    onChange={value => onChange({ ...address, country: value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel
                        id="country-select-label"
                        sx={{ color: 'text.primary', fontWeight: 'bold' }}
                    >
                        Region
                    </InputLabel>
                    <Select
                        labelId="country-select-label"
                        id="country-select"
                        name='region'
                        value={selectedRegion}
                        label="Region"
                        onChange={handleChange}
                        fullWidth
                    >
                        {loading && <MenuItem disabled>Loading...</MenuItem>}
                        {error && <MenuItem disabled>Error: {error}</MenuItem>}
                        {regionOptions}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    name='city'
                    label="Ciudad"
                    variant="outlined"
                    fullWidth
                    value={address.city}
                    onChange={e => onChange({ ...address, city: e.target.value })}
                />
            </Grid>
        </>
    );
}

export default CompanyAddressComponent;

