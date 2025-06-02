import { Box, Icon, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDrawerContext } from "../contexts/DrawerContext";


interface IBasicLayoutProps {
    children: React.ReactNode;
    title: string;
    icon: string;
    toolbar?: React.ReactNode;
}

export const BasicLayout: React.FC<IBasicLayoutProps> = ({ children, title, toolbar, icon }) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const { toggleDrawer } = useDrawerContext();

    return (
        <Box height={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
            <Box padding={1} display={'flex'} height={theme.spacing(smDown ? 4 : mdDown ? 6 : 8)} alignItems={'center'}
                gap={2} borderBottom={`1px solid ${theme.palette.divider}`}>
                {smDown && (
                    <IconButton onClick={toggleDrawer}>
                        <Icon>menu</Icon>
                    </IconButton>
                )}
                <Icon fontSize={smDown ? 'small' : mdDown ? 'medium' : 'large'} color="primary">
                    {icon}
                </Icon>
                <Typography
                    variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    color="primary"
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


