import { supabase } from "@/Database/uiClient";
import useAuthSubscription from "@/hooks/useAuthSubscription";
import useUserDataSync from "@/hooks/useUserDataSync";
import { AuthContext } from "@/Providers/AuthProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  const [unprotectedRoutes, setUnprotectedRoutes] = useState<string[]>([]);
  const { session, isAuthStateLoading } = useAuthSubscription({
    unprotectedRoutes: unprotectedRoutes,
  });

  const { userData, isLoading } = useUserDataSync(
    session as { user: { id: any; email: any } }
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthStateLoading: isAuthStateLoading || isLoading,
        userData,
        isAdmin: userData?.is_admin || false,
      }}
    >
      <Component {...pageProps} />
      <ToastContainer position="bottom-center" />
    </AuthContext.Provider>
  );
}
