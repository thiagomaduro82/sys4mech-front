import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useField } from "@unform/core";
import { CustomerService } from "../../services/api/customer/CustomerService";
import { ICustomerCarsDetail } from "../../services/api/customer-cars/CustomerCarsService";

type TAutoCompleteOptions = {
    uuid: string;
    name: string;
    customerCars?: ICustomerCarsDetail[];
};

interface IAutoCompleteCustomerProps {
    isExternalLoading?: boolean;
    onChange?: (customer: TAutoCompleteOptions | null) => void;
}

export const AutoCompleteCustomer: React.FC<IAutoCompleteCustomerProps> = ({ isExternalLoading = false, onChange }) => {

    const { fieldName, registerField, defaultValue, error, clearError } = useField('customerUuid');

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
        CustomerService.getAll((search === '') ? '' : 'name', search, 0, 10, 'asc').then((result) => {
            setLoading(false);
            if (result instanceof Error) {
                console.error("Error fetching customer:", result.message);
            } else {
                console.log("Fetched customer:", result.content);
                const formattedOptions = result.content.map(customer => ({
                    uuid: customer.uuid,
                    name: customer.name,
                    customerCars: customer.cars
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
            renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" error={!!error}
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

