import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useField } from "@unform/core";

type TAutoCompleteOptions = {
    status: string;
};

interface IAutoCompleteStatusProps {
    isExternalLoading?: boolean;
}

export const AutoCompleteStatus: React.FC<IAutoCompleteStatusProps> = ({ isExternalLoading = false }) => {

    const { fieldName, registerField, defaultValue, error, clearError} = useField('status');
    
    const [options, setOptions] = useState<TAutoCompleteOptions[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(defaultValue);

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => selectedStatus,
            setValue: (_, newValue) => setSelectedStatus(newValue)
        });
    }, [fieldName, registerField, selectedStatus]);
    
    useEffect(() => {
        setLoading(true);
        setOptions([
            {status: 'SCHEDULE'},
            {status: 'IN_PROGRESS'},
            {status: 'COMPLETED'},
            {status: 'CANCELLED'}
        ])
    }, []);

    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedStatus) return null;
        const selectedOption = options.find(option => option.status === selectedStatus);
        return selectedOption;
    }, [selectedStatus, options]);

    return (
        <Autocomplete
            options={options}
            value={autoCompleteSelectedOption}
            getOptionLabel={(option) => option.status}
            disabled={isExternalLoading}
            disablePortal
            renderInput={(params) => <TextField {...params} label="Status" variant="outlined" error={!!error}
            helperText={error}/>}
            onChange={(_, newValue) => { setSelectedStatus(newValue?.status); clearError(); }}
            loading={loading}
            size={'small'}
        />
    );
}

