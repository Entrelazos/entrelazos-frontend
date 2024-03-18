import { CSSProperties, FC, useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchCountries } from '../../store/geo/geoThunks';

interface Country {
    code: string;
    name: string;
}

interface CountrySelectorProps {
    sx?: CSSProperties;
}

const handleCountrySelect = (countryCode) => {
    console.log('Selected country:', countryCode);
    // Do something with the selected country code
};
const countries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    // Add more countries as needed
];

const CountrySelector: FC<CountrySelectorProps> = ({ sx }) => {
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    const handleChange = (event: SelectChangeEvent<string>) => {
        const country = event.target.value;
        setSelectedCountry(country);
        handleCountrySelect(country);
    };

    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector(
        (state: RootState) => state.geo
    );

    useEffect(() => {
        dispatch(fetchCountries());
    }, [dispatch]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (data) {
        console.log(data);

        return (
            <FormControl sx={sx} fullWidth>
                <InputLabel
                    id="country-select-label"
                    sx={{ color: 'text.primary', fontWeight: 'bold' }}
                >
                    Pais
                </InputLabel>
                <Select
                    labelId="country-select-label"
                    id="country-select"
                    name='country'
                    value={selectedCountry}
                    label="Pais"
                    onChange={handleChange}
                    fullWidth
                >
                    {data?.map((country) => (
                        <MenuItem key={country.id} value={country.alpha_code} sx={{ display: "flex" }}>
                            <Box display="flex" alignItems="center">
                                <ReactCountryFlag countryCode={country.alpha_code} style={{ marginRight: "5px" }} />
                                <Typography fontSize={13}>{country.name}</Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
};

export default CountrySelector;
