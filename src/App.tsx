// Update src/App.tsx
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import Components from "./pages/Components";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Settings from "./pages/settings/Settings";
import OAuth2Redirect from "./pages/auth/Oauth2Redirect";
import Navigation from "./pages/Navigation";
import ProtectedLayout from "./pages/ProtectedLayout";
import ToastContainer from "./components/ToastItem";
import MfaVerification from "./components/MfaVarification";
import CreateGrantProgram from "./pages/createGrantProgram/CreateGrantProgram"
import CreateOrganisation from "./pages/createOrganisation/CreateOrganisation"
import GrantManagement from "./pages/grantManagement/GrantManagement";
import ProviderLayout from "./pages/ProviderLayout";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
            <Route path="/mfa-verification" element={<MfaVerification />} />
            <Route path="/components" element={<Components />} />
            {/* Provider routes nested under ProtectedLayout and ProviderLayout */}
            <Route element={<ProtectedLayout />}>
              <Route element={<ProviderLayout />}>
                <Route path="/grant-management/*" element={<GrantManagement />} />
                <Route path="/create-grant/:grantProgramId/*" element={<CreateGrantProgram />} />
                <Route path="/organisation/*" element={<CreateOrganisation />} />
              </Route>
              <Route path="settings" element={<Settings />} />
              {/* Other protected routes */}
            </Route>
            {/* Catch all - redirect to signin */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
          <ToastContainer />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
