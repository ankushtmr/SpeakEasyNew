// src/components/RequireAuth.tsx
import { useAuth0 } from "@auth0/auth0-react";
import type { PropsWithChildren } from "react";

export default function RequireAuth({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <p>Loading auth…</p>;
  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }
  return <>{children}</>;
}
