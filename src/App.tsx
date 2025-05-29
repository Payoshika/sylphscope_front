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
import Navigation from "./pages/Navigation";
import ProtectedRoute from "./pages/ProtectedRoute";
import ToastContainer from "./components/ToastItem";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            {/* Protected routes */}
            <Route
              path="/components"
              element={
                <ProtectedRoute>
                  <Components />
                </ProtectedRoute>
              }
            />
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/components" replace />} />
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
