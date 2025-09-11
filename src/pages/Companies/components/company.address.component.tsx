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
import { FC, useEffect, useMemo, useState, memo, useCallback } from 'react';
import CountrySelector from '../../../components/CountrySelect';
import { fetchRegions, fetchCities } from '../../../store/geo/geoThunks'; // Assuming fetchCities function exists
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { AddressData } from '../../../types/address/AddressTypes';

interface CompanyAddressComponentProps {
  address: AddressData;
  onChange: (newData: AddressData) => void;
}

const CompanyAddressComponent: FC<CompanyAddressComponentProps> = memo(
  ({ address, onChange }) => {
    const [selectedLocation, setSelectedLocation] = useState({
      region: address.region || '',
      city: address.city || '',
    });

    const handleRegionChange = useCallback(
      (event: SelectChangeEvent<string>) => {
        const region = event.target.value;
        setSelectedLocation((prev) => ({ ...prev, region }));
        onChange({ ...address, region });
      },
      [address, onChange]
    );

    const handleCityChange = useCallback(
      (event: SelectChangeEvent<string>) => {
        const city = event.target.value;
        setSelectedLocation((prev) => ({ ...prev, city }));
        onChange({ ...address, city });
      },
      [address, onChange]
    );

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
        <Grid size={{ xs: 12, sm: 6 }}>
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelector
            value={address.country}
            onChange={(value) => onChange({ ...address, country: value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
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
              {regionError && (
                <MenuItem disabled>Error: {regionError}</MenuItem>
              )}
              {regionOptions}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
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
  }
);

CompanyAddressComponent.displayName = 'CompanyAddressComponent';

export default CompanyAddressComponent;
