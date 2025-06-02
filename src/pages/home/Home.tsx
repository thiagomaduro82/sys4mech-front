import { ToolbarDetail } from "../../shared/components";
import { BasicLayout } from "../../shared/layouts"

export const Home = () => {
    return (
        <BasicLayout title={'Home'} icon="home" toolbar={<ToolbarDetail />}>
            <h1>Home</h1>
        </BasicLayout>
    );
}