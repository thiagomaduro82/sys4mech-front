import { Box, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

import { useDrawerContext } from "../../contexts/DrawerContext";
import { useAppThemeContext } from "../../contexts";
import logo from '../../../assets/images/logo.png';

interface ISideMenuProps {
    children: React.ReactNode;
};

interface IListItemLinkProps {
    label: string;
    icon: string;
    to: string;
    onClick?: (() => void) | undefined;
};

const ListItemLink: React.FC<IListItemLinkProps> = ({ label, icon, to, onClick }) => {

    const navigate = useNavigate();
    const resolvePath = useResolvedPath(to);
    const match = useMatch({ path: resolvePath.pathname, end: false });

    const handleClick = () => {
        navigate(to);
        onClick?.();
    };

    return (
        <ListItemButton selected={!!match} onClick={handleClick}>
            <ListItemIcon>
                <Icon>{icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
};

export const SideMenu: React.FC<ISideMenuProps> = ({ children }) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const { isOpen, toggleDrawer, drawerOptions } = useDrawerContext();
    const { toggleTheme } = useAppThemeContext();

    return (
        <>
            <Drawer variant={smDown ? 'temporary' : 'permanent'} open={isOpen} onClose={toggleDrawer}>
                <Box width={theme.spacing(28)} height={'100%'} display={'flex'} flexDirection={'column'} >
                    <Box width={'100%'} height={theme.spacing(20)} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <img src={logo} alt="Logo" style={{ width: '80%', height: 'auto' }} />
                    </Box>
                    <Box flex={1} >
                        <List component={'nav'} >
                            {drawerOptions.map(drawerOptions => (
                                <ListItemLink
                                    key={drawerOptions.path}
                                    label={drawerOptions.label}
                                    icon={drawerOptions.icon}
                                    to={drawerOptions.path}
                                    onClick={toggleDrawer}
                                />
                            ))}
                        </List>
                    </Box>
                    <Box>
                        <List component={'nav'} >
                            <ListItemButton onClick={toggleTheme}>
                                <ListItemIcon>
                                    <Icon>brightness_6</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Toggle Theme" />
                            </ListItemButton>
                        </List>
                    </Box>
                </Box>
            </Drawer>
            <Box height={'100vh'} marginLeft={smDown ? 0 : theme.spacing(28)} >
                {children}
            </Box>

        </>
    );
};

