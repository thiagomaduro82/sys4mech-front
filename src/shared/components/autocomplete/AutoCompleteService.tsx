import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useField } from "@unform/core";
import { ServiceService } from "../../services/api/service/ServiceService";

type TAutoCompleteOptions = {
    uuid: string;
    name: string;
    amount: number;
};

interface IAutoCompleteServiceProps {
    isExternalLoading?: boolean;
    onChange?: (service: TAutoCompleteOptions | null) => void;
}

export const AutoCompleteService: React.FC<IAutoCompleteServiceProps> = ({ isExternalLoading = false, onChange }) => {

    const { fieldName, registerField, defaultValue, error, clearError } = useField('serviceUuid');

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
        ServiceService.getAll((search === '') ? '' : 'name', search, 0, 10, 'asc').then((result) => {
            setLoading(false);
            if (result instanceof Error) {
                console.error("Error fetching service:", result.message);
            } else {
                console.log("Fetched service:", result.content);
                const formattedOptions = result.content.map(service => ({
                    uuid: service.uuid,
                    name: service.name,
                    amount: service.amount
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
            renderInput={(params) => <TextField {...params} label="Service" variant="outlined" error={!!error}
                helperText={error} />}
            onChange={(_, newValue) => {
                setSelectedUuid(newValue?.uuid);
                setSearch('');
                clearError();
                if (onChange) onChange(newValue || null);
            }}
            loading={loading}
            size={'small'}
        />
    );
}

