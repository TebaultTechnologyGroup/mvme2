// src/components/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { Center, Loader } from "@mantine/core";
import { useAuth } from "./AuthProvider";

export default function RequireAuth() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  if (!session) return <Navigate to="/" replace state={{ from: location }} />;

  return <Outlet />;
}
