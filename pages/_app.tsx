import useAuthSubscription from "@/hooks/useAuthSubscription";
import { AuthContext } from "@/Providers/AuthProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  const [unprotectedRoutes, setUnprotectedRoutes] = useState<string[]>([]);
  const { session, isAuthStateLoading } = useAuthSubscription({
    unprotectedRoutes: unprotectedRoutes,
  });
  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthStateLoading,
      }}
    >
      <Component {...pageProps} />
      <ToastContainer position="bottom-center" />
    </AuthContext.Provider>
  );
}
