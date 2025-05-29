import { BrowserRouter } from "react-router-dom";
import { AppThemeProvider } from "./shared/contexts";
import { DrawerProvider } from "./shared/contexts/DrawerContext";
import { SideMenu } from "./shared/components";
import { AppRoutes } from "./routes";

export const App = () => {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <SideMenu>
            <AppRoutes />
          </SideMenu>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
}
