import { TextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

type FormTextfieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> & TextFieldProps;

export const FormTextfield = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  ...textFieldProps
}: FormTextfieldProps<TFieldValues, TName>) => {
  const {
    field: { value, onBlur, onChange },
    fieldState: { invalid, error },
  } = useController({ control, name });

  return (
    <TextField
      {...textFieldProps}
      value={value != null ? value : ''}
      onBlur={onBlur}
      onChange={onChange}
      error={invalid}
      helperText={error?.message ?? ' '}
    />
  );
};
