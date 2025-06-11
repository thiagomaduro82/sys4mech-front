import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { useEffect, useState } from "react";


type TVTExtField = TextFieldProps & {
    name: string;
};

export const VTextField: React.FC<TVTExtField> = ({ name, ...rest }) => {

    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);
    const [value, setValue] = useState(defaultValue || '');

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        });
    }, [fieldName, registerField, value]);

    return (
        <TextField
            {...rest}
            error={!!error}
            helperText={error}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {setValue(e.target.value); rest.onChange?.(e); }}
            onKeyDown={(e) => {error && clearError(); rest.onKeyDown?.(e); }}
        />
    );
};

