import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material";

interface IToolbarListProps {
    searchText?: string;
    onSearchTextChange?: (text: string) => void;
    onButtonClick?: () => void;
};

export const ToolbarList: React.FC<IToolbarListProps> = ({
    searchText = '', onSearchTextChange, onButtonClick
}) => {

    const theme = useTheme();

    return (
        <Box component={Paper} height={theme.spacing(5)} display="flex" alignItems="center" padding={1} margin={1} gap={1}>
            <TextField size={'small'} placeholder="Search" value={searchText} onChange={(e) => onSearchTextChange?.(e.target.value)} />
            <Box flex={1} display={'flex'} justifyContent={'end'}>
                <Button variant="contained" color="primary" disableElevation startIcon={<Icon>add</Icon>} onClick={onButtonClick}>
                    New
                </Button>
            </Box>
        </Box>
    );
};