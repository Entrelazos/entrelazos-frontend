import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchCountries } from '../../store/geo/geoThunks';

interface CountrySelectorProps {
  value?: string;
  onChange?: (countryCode: string) => void;
  sx?: CSSProperties;
}

const CountrySelector: FC<CountrySelectorProps> = ({ value, onChange, sx }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(value || '');

  const handleChange = (event: SelectChangeEvent<string>) => {
    const country = event.target.value;
    setSelectedCountry(country);
    if (onChange) {
      onChange(country);
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.country
  );

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  // Memoize the data returned from useSelector
  const memoizedData = useMemo(() => data, [data]);

  return (
    <FormControl sx={sx} fullWidth>
      <InputLabel
        id='country-select-label'
        sx={{ color: 'text.primary', fontWeight: 'bold' }}
      >
        Pais
      </InputLabel>
      <Select
        labelId='country-select-label'
        id='country-select'
        name='country'
        value={selectedCountry}
        label='Pais'
        onChange={handleChange}
        fullWidth
      >
        {loading && <MenuItem disabled>Loading...</MenuItem>}
        {error && <MenuItem disabled>Error: {error}</MenuItem>}
        {memoizedData?.map((country) => (
          <MenuItem
            key={country.id}
            value={country.id}
            sx={{ display: 'flex' }}
          >
            <Box display='flex' alignItems='center'>
              <ReactCountryFlag
                countryCode={country.alpha_code}
                style={{ marginRight: '5px' }}
              />
              <Typography fontSize={13}>{country.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CountrySelector;
