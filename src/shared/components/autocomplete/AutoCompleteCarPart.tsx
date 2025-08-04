import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useField } from "@unform/core";
import { CarPartService } from "../../services/api/car-part/CarPartService";

type TAutoCompleteOptions = {
    uuid: string;
    name: string;
    amount: number;
};

interface IAutoCompleteCarPartProps {
    isExternalLoading?: boolean;
    onChange?: (service: TAutoCompleteOptions | null) => void;
}

export const AutoCompleteCarPart: React.FC<IAutoCompleteCarPartProps> = ({ isExternalLoading = false, onChange }) => {

    const { fieldName, registerField, defaultValue, error, clearError} = useField('carPartUuid');
    
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
        CarPartService.getAll((search === '') ? '': 'name', search, 0, 10, 'asc').then((result) => {
            setLoading(false);
            if (result instanceof Error) {
                console.error("Error fetching car-part:", result.message);
            } else {
                console.log("Fetched car-part:", result.content);
                const formattedOptions = result.content.map(carPart => ({
                    uuid: carPart.uuid,
                    name: carPart.name,
                    amount: carPart.sellingPrice
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
            renderInput={(params) => <TextField {...params} label="Car part" variant="outlined" error={!!error}
            helperText={error}/>}
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

