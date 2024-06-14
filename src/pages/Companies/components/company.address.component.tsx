import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import CountrySelector from '../../../components/CountrySelect';
import { fetchRegions, fetchCities } from '../../../store/geo/geoThunks'; // Assuming fetchCities function exists
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { AddressData } from '../../../types/address/AddressTypes';

interface CompanyAddressComponentProps {
  address: AddressData;
  onChange: (newData: AddressData) => void;
}

const CompanyAddressComponent: FC<CompanyAddressComponentProps> = ({
  address,
  onChange,
}) => {
  const [selectedLocation, setSelectedLocation] = useState({
    region: address.region || '',
    city: address.city || '',
  });

  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    const region = event.target.value;
    setSelectedLocation({ ...selectedLocation, region });
    if (onChange) {
      onChange({ ...address, region });
    }
  };

  const handleCityChange = (event: SelectChangeEvent<string>) => {
    const city = event.target.value;
    setSelectedLocation({ ...selectedLocation, city });
    if (onChange) {
      onChange({ ...address, city });
    }
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (address.country) {
      dispatch(fetchRegions(parseInt(address.country)));
    }
  }, [address.country]);

  useEffect(() => {
    if (selectedLocation.region) {
      dispatch(fetchCities(parseInt(selectedLocation.region)));
    }
  }, [selectedLocation.region]);

  const {
    data: regionData,
    loading: regionLoading,
    error: regionError,
  } = useSelector((state: RootState) => state.regions);

  const {
    data: cityData,
    loading: cityLoading,
    error: cityError,
  } = useSelector((state: RootState) => state.cities);

  const regionOptions = useMemo(() => {
    return regionData?.map((region) => (
      <MenuItem key={region.id} value={region.id} sx={{ display: 'flex' }}>
        <Box display='flex' alignItems='center'>
          <Typography fontSize={13}>{region.name}</Typography>
        </Box>
      </MenuItem>
    ));
  }, [regionData]);

  const cityOptions = useMemo(() => {
    return cityData?.map((city) => (
      <MenuItem key={city.id} value={city.id} sx={{ display: 'flex' }}>
        <Box display='flex' alignItems='center'>
          <Typography fontSize={13}>{city.name}</Typography>
        </Box>
      </MenuItem>
    ));
  }, [cityData]);

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          name='nomenclature'
          label='Direccion'
          variant='outlined'
          fullWidth
          value={address.nomenclature}
          onChange={(e) =>
            onChange({ ...address, nomenclature: e.target.value })
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CountrySelector
          value={address.country}
          onChange={(value) => onChange({ ...address, country: value })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel
            id='region-select-label'
            sx={{ color: 'text.primary', fontWeight: 'bold' }}
          >
            Region
          </InputLabel>
          <Select
            labelId='region-select-label'
            id='region-select'
            name='region'
            value={selectedLocation.region}
            label='Region'
            onChange={handleRegionChange}
            fullWidth
          >
            {regionLoading && <MenuItem disabled>Loading...</MenuItem>}
            {regionError && <MenuItem disabled>Error: {regionError}</MenuItem>}
            {regionOptions}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel
            id='city-select-label'
            sx={{ color: 'text.primary', fontWeight: 'bold' }}
          >
            City
          </InputLabel>
          <Select
            labelId='city-select-label'
            id='city-select'
            name='city'
            value={selectedLocation.city}
            label='City'
            onChange={handleCityChange}
            fullWidth
          >
            {cityLoading && <MenuItem disabled>Loading...</MenuItem>}
            {cityError && <MenuItem disabled>Error: {cityError}</MenuItem>}
            {cityOptions}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
};

export default CompanyAddressComponent;
