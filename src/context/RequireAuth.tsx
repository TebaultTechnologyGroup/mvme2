/**
 * If the user is not logged in, then redirect them to a non application page.
 * This will wrap all pages that non authenticated users should avoid,
 * which is pretty much anything in the /app or /admin folders.
 *
 */
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
