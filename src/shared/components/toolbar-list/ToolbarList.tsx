import { Box, Button, FormControl, Icon, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, useTheme } from "@mui/material";
import { useState } from "react";

export interface ISearchParams {
    pageSize: number;
    field?: string;
    searchFor?: string;
    order: string;
};

interface IToolbarListProps {
    pageSizeList: number[];
    fieldsList: string[];
    orderList: string[];
    onClickSearchButton?: (searchParams: ISearchParams) => void;
}

export const ToolbarList: React.FC<IToolbarListProps> = ({ pageSizeList, fieldsList, orderList, onClickSearchButton }) => {

    const theme = useTheme();

    const [searchFor, setSearchFor] = useState('');
    const [pageSize, setPageSize] = useState(pageSizeList[0]);
    const [field, setField] = useState(fieldsList[0]);
    const [order, setOrder] = useState(orderList[0]);

    const handleChangePageSize = (event: SelectChangeEvent) => {
        setPageSize(Number(event.target.value));
    }
    const handleChangeField = (event: SelectChangeEvent) => {
        setField(event.target.value);
    }
    const handleChangeOrder = (event: SelectChangeEvent) => {
        setOrder(event.target.value);
    }
    const handleChangeSearchFor = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchFor(event.target.value);
    }

    return (
        <Box
            component={Paper}
            height={theme.spacing(5)}
            marginX={1}
            padding={1}
            paddingX={2}
            display={'flex'}
            alignItems={'center'}
            gap={1}
        >
            <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="label-select-page-size">Page size</InputLabel>
                <Select
                    labelId="label-select-page-size"
                    id="select-page-size"
                    value={pageSize.toString()}
                    label="Page size"
                    onChange={handleChangePageSize}
                >
                    {pageSizeList && (
                        pageSizeList.map((item) => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                        ))

                    )}
                </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel id="label-select-field">Field</InputLabel>
                <Select
                    labelId="label-select-field"
                    id="select-field"
                    value={field}
                    label="Field"
                    onChange={handleChangeField}
                >
                    {fieldsList && (
                        fieldsList.map((item) => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                        ))

                    )}
                </Select>
            </FormControl>
            <TextField
                size={'small'}
                value={searchFor}
                onChange={handleChangeSearchFor}
                fullWidth
                label="Look for"
            />
            <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="label-select-order-by">Order by</InputLabel>
                <Select
                    labelId="label-select-order-by"
                    id="select-order-by"
                    value={order}
                    label="Order by"
                    onChange={handleChangeOrder}
                >
                    {orderList && (
                        orderList.map((item) => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                        ))

                    )}
                </Select>
            </FormControl>

            <Box display={'flex'} flex={1} justifyContent={'start'}>
                <Button
                    color="primary"
                    variant="contained"
                    startIcon={<Icon>search</Icon>}
                    onClick={() => onClickSearchButton?.({pageSize, field, searchFor, order})}
                    title="Submit the search"
                >
                    Search
                </Button>
            </Box>

        </Box>
    );
};