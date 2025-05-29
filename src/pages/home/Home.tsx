import { BasicLayout } from "../../shared/layouts"

export const Home = () => {
    return (
        <BasicLayout title={'Home'} toolbar={<>Toolbar</>}>
            <h1>Home</h1>
        </BasicLayout>
    );
}