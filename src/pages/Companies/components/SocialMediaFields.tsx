import { FC, memo } from 'react';
import {
  TextField,
  Stack,
  InputAdornment,
  Typography,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { SOCIAL_NETWORK_DATA } from '../../../constants/constants';
import { SocialType } from '../../../types/social/SocialTypes';

interface SocialMediaFieldsProps {
  social: SocialType;
  onSocialChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    basePath: string
  ) => void;
  onSocialDirectChange: (name: string, value: string) => void;
}

const SocialMediaFields: FC<SocialMediaFieldsProps> = memo(({
  social,
  onSocialChange,
  onSocialDirectChange,
}) => {
  return (
    <Stack direction='column' spacing={3}>
      {SOCIAL_NETWORK_DATA.map(
        ({
          name,
          label,
          icon: Icon,
          fieldType,
          basePath,
          isRequired,
        }) =>
          name === 'phone_number' || name === 'whatsapp' ? (
            <MuiTelInput
              defaultCountry='CO'
              margin='normal'
              fullWidth
              key={name}
              label={label}
              name={name}
              autoComplete={name}
              required={isRequired}
              value={social[name] ?? ''}
              onChange={(value) => {
                onSocialDirectChange(name, value);
              }}
            />
          ) : (
            <TextField
              name={name}
              label={label}
              type={fieldType}
              key={name}
              required={isRequired}
              onChange={(event) =>
                onSocialChange(event, basePath || '')
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon />
                      <Typography
                        variant='body2'
                        color='textSecondary'
                        style={{ marginLeft: 8 }}
                      >
                        {basePath}
                      </Typography>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )
      )}
    </Stack>
  );
});

SocialMediaFields.displayName = 'SocialMediaFields';

export default SocialMediaFields;