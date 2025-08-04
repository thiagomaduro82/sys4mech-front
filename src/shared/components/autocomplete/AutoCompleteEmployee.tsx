import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useField } from "@unform/core";
import { EmployeeService } from "../../services/api/employee/EmployeeService";

type TAutoCompleteOptions = {
    uuid: string;
    name: string;
};

interface IAutoCompleteEmployeeProps {
    isExternalLoading?: boolean;
}

export const AutoCompleteEmployee: React.FC<IAutoCompleteEmployeeProps> = ({ isExternalLoading = false }) => {

    const { fieldName, registerField, defaultValue, error, clearError} = useField('employeeUuid');
    
    const [options, setOptions] = useState<TAutoCompleteOptions[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState<string>('');
    const [selectedUuid, setSelectedUuid] = useState<string | undefined>(defaultValue);

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => selectedUuid,
            setValue: (_, newValue) => setSelectedUuid(newValue)
        });
    }, [fieldName, registerField, selectedUuid]);
    
    useEffect(() => {
        setLoading(true);
        EmployeeService.getAll((search === '') ? '': 'name', search, 0, 10, 'asc').then((result) => {
            setLoading(false);
            if (result instanceof Error) {
                console.error("Error fetching employee:", result.message);
            } else {
                console.log("Fetched employee:", result.content);
                const formattedOptions = result.content.map(employee => ({
                    uuid: employee.uuid,
                    name: employee.name
                }));
                setOptions(formattedOptions);
            }
        });
    }, [search]);

    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedUuid) return null;
        const selectedOption = options.find(option => option.uuid === selectedUuid);
        return selectedOption;
    }, [selectedUuid, options]);

    return (
        <Autocomplete
            options={options}
            value={autoCompleteSelectedOption}
            getOptionLabel={(option) => option.name}
            disabled={isExternalLoading}
            disablePortal
            onInputChange={(_, newValue) => setSearch(newValue)}
            renderInput={(params) => <TextField {...params} label="Employee" variant="outlined" error={!!error}
            helperText={error}/>}
            onChange={(_, newValue) => { setSelectedUuid(newValue?.uuid); setSearch(''); clearError(); }}
            loading={loading}
            size={'small'}
        />
    );
}

