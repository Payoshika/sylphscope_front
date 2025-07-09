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
            <Route path="create-dev/grant/*" element={<CreateGrantProgram />} />
            {/* Protected routes - all nested under ProtectedLayout */}
            <Route path="/" element={<ProtectedLayout />}>
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/grant" element={<ProtectedLayout />}>
              <Route path="create/*" element={<CreateGrantProgram />} />
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
