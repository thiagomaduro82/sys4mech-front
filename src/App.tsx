import { BrowserRouter } from "react-router-dom";
import { AppThemeProvider, AuthProvider } from "./shared/contexts";
import { DrawerProvider } from "./shared/contexts/DrawerContext";
import { Login, SideMenu } from "./shared/components";
import { AppRoutes } from "./routes";

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <DrawerProvider>
            <BrowserRouter>
              <SideMenu>
                <AppRoutes />
              </SideMenu>
            </BrowserRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  );
}
