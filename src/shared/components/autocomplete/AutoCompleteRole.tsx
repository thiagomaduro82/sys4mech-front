import { useEffect, useMemo, useState } from "react";
import { RoleService } from "../../services/api/role/RoleService";
import { Autocomplete, TextField } from "@mui/material";
import { useField } from "@unform/core";


type TAutoCompleteOptions = {
    uuid: string;
    name: string;
};

interface IAutoCompleteRoleProps {
    isExternalLoading?: boolean;
}

export const AutoCompleteRole: React.FC<IAutoCompleteRoleProps> = ({ isExternalLoading = false }) => {

    const { fieldName, registerField, defaultValue, error, clearError} = useField('roleUuid');
    
    const [options, setOptions] = useState<TAutoCompleteOptions[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState<string>("");
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
        RoleService.getAll(search, 1, 10, 'asc').then((result) => {
            setLoading(false);
            if (result instanceof Error) {
                console.error("Error fetching roles:", result.message);
            } else {
                const formattedOptions = result.content.map(role => ({
                    uuid: role.uuid,
                    name: role.name
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
            renderInput={(params) => <TextField {...params} label="Role" variant="outlined" error={!!error}
            helperText={error}/>}
            onChange={(_, newValue) => { setSelectedUuid(newValue?.uuid); setSearch(''); clearError(); }}
            loading={loading}
        />
    );
}

