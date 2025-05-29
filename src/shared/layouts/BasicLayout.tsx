import { Box, Icon, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDrawerContext } from "../contexts/DrawerContext";


interface IBasicLayoutProps {
    children: React.ReactNode;
    title: string;
    toolbar?: React.ReactNode;
}

export const BasicLayout: React.FC<IBasicLayoutProps> = ({ children, title, toolbar }) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const { toggleDrawer } = useDrawerContext();

    return (
        <Box height={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
            <Box padding={1} display={'flex'} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} alignItems={'center'} gap={1}>
                {smDown && (
                    <IconButton onClick={toggleDrawer}>
                        <Icon>menu§</Icon>
                    </IconButton>
                )}
                <Typography
                    variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                >
                    {title}
                </Typography>
            </Box>
            {toolbar && (
                <Box>
                    {toolbar}
                </Box>
            )}
            <Box flex={1} overflow={'auto'}>
                {children}
            </Box>
        </Box>
    );
};


