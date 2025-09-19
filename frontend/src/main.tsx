import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./app/routes";
import { queryClient } from "./app/queryClient";

// Auth0
import { Auth0Provider } from "@auth0/auth0-react";

/**
 * Read required env vars at build time (Vite).
 * If any are missing, fail fast so you know to set .env.production correctly.
 */
const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

/**
 * Scopes:
 * - Basic OIDC: openid profile email
 * - API permissions: engagements:read engagements:write
 *   (Make sure these exist in Auth0 API > Permissions, and are assigned to your user via a Role,
 *    and that “RBAC” + “Add Permissions in the Access Token” are enabled.)
 */
const scope =
  (import.meta.env.VITE_AUTH0_SCOPE as string) ??
  "openid profile email engagements:read engagements:write";

if (!domain || !clientId || !audience) {
  // Helpful error in dev builds; in production this won’t show
  // but it avoids silently requesting a token without the right audience.
  // eslint-disable-next-line no-console
  console.error("Missing Auth0 env vars. Check VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE.");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience, // ✅ critical: must match your backend’s AUTH0_AUDIENCE and Auth0 API Identifier
        scope,    // ✅ include API permissions so the access token has them
      }}
      cacheLocation="localstorage" // keeps session on refresh (POC-friendly)
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
