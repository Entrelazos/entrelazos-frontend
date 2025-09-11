import { FC, memo } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CompanyAddressComponent from './company.address.component';
import { AddressData } from '../../../types/address/AddressTypes';
import { useRefsList } from '../../../hooks/useRefsList';
import '../companies.form.styles.scss';

interface AddressSectionProps {
  addresses: AddressData[];
  onAddressChange: (index: number, newData: AddressData) => void;
  onAddAddress: () => void;
  onRemoveAddress: () => void;
}

const AddressSection: FC<AddressSectionProps> = memo(
  ({ addresses, onAddressChange, onAddAddress, onRemoveAddress }) => {
    const nodeRefs = useRefsList<HTMLDivElement>(addresses.length);

    return (
      <Card variant='outlined' sx={{ borderRadius: '12px' }}>
        <CardHeader title='Direcciones' />
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TransitionGroup
            style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}
          >
            {addresses.map((address, index) => (
              <CSSTransition
                key={index}
                timeout={300}
                classNames='fade'
                nodeRef={nodeRefs[index]}
              >
                <div ref={nodeRefs[index]} style={{ flex: '1 1 500px' }}>
                  <Card raised sx={{ borderRadius: '12px' }}>
                    <CardHeader title={`Dirección ${index + 1}`} />
                    <CardContent>
                      <Grid container spacing={2}>
                        <CompanyAddressComponent
                          address={address}
                          onChange={(newData: AddressData) =>
                            onAddressChange(index, newData)
                          }
                        />
                      </Grid>
                    </CardContent>
                  </Card>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
          <Box display='flex' gap={2} justifyContent='end'>
            {addresses.length > 0 && (
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={onRemoveAddress}
              >
                Remover Dirección
              </Button>
            )}
            <Button
              type='button'
              variant='contained'
              color='primary'
              onClick={onAddAddress}
            >
              Agregar Dirección
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

AddressSection.displayName = 'AddressSection';

export default AddressSection;
