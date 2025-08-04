import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useField } from "@unform/core";
import { ICustomerCarsDetail } from "../../services/api/customer-cars/CustomerCarsService";

type TAutoCompleteOptions = {
    uuid: string;
    registrationNumber: string;
};

interface IAutoCompleteCustomerCarProps {
    isExternalLoading?: boolean;
    customerCars: ICustomerCarsDetail[];
}

export const AutoCompleteCustomerCar: React.FC<IAutoCompleteCustomerCarProps> = ({ isExternalLoading = false, customerCars = [] }) => {

    const { fieldName, registerField, defaultValue, error, clearError } = useField('customerCarUuid');

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
        let formattedOptions: TAutoCompleteOptions[] = [];
        if (customerCars.length !== 0) {
            formattedOptions = customerCars.map(customerCar => ({
                uuid: customerCar.uuid,
                registrationNumber: customerCar.registrationNumber
            }));
        }
        setOptions(formattedOptions);
        setLoading(false);
    }, [customerCars]);

    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedUuid) return null;
        const selectedOption = options.find(option => option.uuid === selectedUuid);
        return selectedOption;
    }, [selectedUuid, options]);

    return (
        <Autocomplete
            options={options}
            value={autoCompleteSelectedOption}
            getOptionLabel={(option) => option.registrationNumber}
            disabled={isExternalLoading}
            disablePortal
            onInputChange={(_, newValue) => setSearch(newValue)}
            renderInput={(params) => <TextField {...params} label="Customer Car" variant="outlined" error={!!error}
                helperText={error} />}
            onChange={(_, newValue) => { setSelectedUuid(newValue?.uuid); setSearch(''); clearError(); }}
            loading={loading}
            size={'small'}
        />
    );
}

