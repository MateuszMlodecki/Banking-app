import {
  Autocomplete,
  AutocompleteProps,
  CircularProgress,
  TextField,
  TextFieldProps,
  InputBaseProps,
} from '@mui/material';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

type FormAutocompleteProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption,
> = UseControllerProps<TFieldValues, TName> &
  Omit<AutocompleteProps<TOption, false, false, false>, 'renderInput' | 'value' | 'onChange'> & {
    label?: string;
    options: TOption[];
    loading?: boolean;
    getOptionLabel: (option: TOption) => string;
    isOptionEqualToValue?: (option: TOption, value: TOption) => boolean;
    renderInputProps?: TextFieldProps & { slotProps?: { input?: Partial<InputBaseProps> } };
    onChangeExtra?: (newValue: TOption | null) => void;
  };

export const FormAutocomplete = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption,
>({
  control,
  name,
  rules,
  options,
  loading = false,
  label,
  getOptionLabel,
  isOptionEqualToValue,
  renderInputProps,
  onChangeExtra,
  ...autocompleteProps
}: FormAutocompleteProps<TFieldValues, TName, TOption>) => {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({ control, name, rules });

  return (
    <Autocomplete<TOption, false, false, false>
      {...autocompleteProps}
      options={options}
      loading={loading}
      value={value as TOption | null}
      onChange={(_event, newValue) => {
        onChange(newValue);
        if (onChangeExtra) {
          onChangeExtra(newValue);
        }
      }}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      renderInput={params => (
        <TextField
          {...params}
          {...renderInputProps}
          label={label}
          inputRef={ref}
          onBlur={onBlur}
          error={invalid}
          helperText={error?.message ?? ' '}
          slotProps={{
            input: {
              ...params.InputProps,
              ...renderInputProps?.slotProps?.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {renderInputProps?.slotProps?.input?.endAdornment ||
                    params.InputProps.endAdornment}
                </>
              ),
              startAdornment:
                renderInputProps?.slotProps?.input?.startAdornment ||
                params.InputProps.startAdornment,
            },
          }}
        />
      )}
    />
  );
};
