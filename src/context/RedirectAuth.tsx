/**
 * If the user is logged in, then redirect them to an application page.
 * This will wrap all pages that authenticated users should avoid.
 * For example, Login, Registration, LandingPage, etc.
 *
 */
import { Navigate, Outlet, useLocation } from "react-router";
import { Center, Loader } from "@mantine/core";
import { useAuth } from "./AuthProvider";

export default function RedirectAuth() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  if (session) return <Navigate to="/app" replace state={{ from: location }} />;

  return <Outlet />;
}
