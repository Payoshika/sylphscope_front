import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";
import { getProviderById } from "../services/ProviderService";
import type { Provider } from "../types/provider";
import type { ProviderStaff } from "../types/user";

const ProviderLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [providerStaff, setProviderStaff] = useState<ProviderStaff | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!user) return;
      try {
        const staffRes = await AuthService.getStaffByUserId(user.id);
        if (!staffRes || !staffRes.data) {
          setProviderStaff(null);
          setProvider(null);
          setLoading(false);
          return;
        }
        setProviderStaff(staffRes.data);
        if(staffRes.data.providerId === null || staffRes.data.providerId === "") {
          setProvider(null);
        }
        else{
          const providerRes = await getProviderById(staffRes.data.providerId ? staffRes.data.providerId : "");
          setProvider(providerRes.data);
        }
      } catch (err) {
        setProviderStaff(null);
        setProvider(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="grid">
        <div className="card">
          <div className="card__body">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not provider staff, redirect to signin or another page
  if (!providerStaff) {
    return <Navigate to="/signin" replace />;
  }

  // Pass providerStaff and provider as context or props to children if needed
  return (
      <Outlet context={{ providerStaff, provider }} />
  );
};

export default ProviderLayout;