import {
  Autocomplete,
  AutocompleteProps,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

type FormAutocompleteProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<AutocompleteProps<Option, false, false, false>, 'renderInput'> & {
    label?: string;
    options: Option[];
    loading?: boolean;
    muiTextFieldProps?: TextFieldProps;
  };

export const FormAutocomplete = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  options,
  loading = false,
  label,
  getOptionLabel,
  isOptionEqualToValue,
  muiTextFieldProps,
  ...autocompleteProps
}: FormAutocompleteProps<TFieldValues, TName>) => {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({ control, name });

  return (
    <Autocomplete
      {...autocompleteProps}
      options={options}
      loading={loading}
      value={options.find(option => option.value === value) || { label: '', value: '' }}
      onChange={(_, newValue) => onChange(newValue?.value)}
      isOptionEqualToValue={(option, value) => option.value === value?.value}
      getOptionLabel={option => option.label}
      renderInput={params => (
        <TextField
          {...params}
          {...muiTextFieldProps}
          label={label}
          inputRef={ref}
          onBlur={onBlur}
          error={invalid}
          helperText={error?.message ?? ' '}
          slotProps={{
            input: {
              ...params.InputProps,
              ...muiTextFieldProps?.slotProps?.input,
              endAdornment: <>{loading ? <CircularProgress color="inherit" size={20} /> : null}</>,
            },
          }}
        />
      )}
    />
  );
};
