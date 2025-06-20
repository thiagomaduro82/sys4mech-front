import { Box } from "@mui/material";
import { BasicLayout } from "../../shared/layouts"

export const Home = () => {
    return (
        <BasicLayout title={'Home'} icon="home" >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                
            </Box>
        </BasicLayout>
    );
}