import { useAuth0 } from "@auth0/auth0-react";

export default function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Log in</button>;
  }
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span>Hi, {user?.name || user?.email}</span>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}>
        Log out
      </button>
    </div>
  );
}
