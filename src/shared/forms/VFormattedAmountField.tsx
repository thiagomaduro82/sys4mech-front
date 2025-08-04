import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { TextField } from '@mui/material';

export const VFormattedAmountField: React.FC<any> = ({ name, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => inputRef.current?.value || '',
      setValue: (_, value) => {
        if (inputRef.current) {
          inputRef.current.value = parseFloat(value).toFixed(2);
        }
      },
      clearValue: () => {
        if (inputRef.current) inputRef.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <TextField
      {...rest}
      name={name}
      inputRef={inputRef}
      defaultValue={parseFloat(defaultValue || 0).toFixed(2)}
      error={!!error}
      helperText={error}
    />
  );
};
