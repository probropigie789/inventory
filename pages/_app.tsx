import useAuthSubscription from "@/hooks/useAuthSubscription";
import { AuthContext } from "@/Providers/AuthProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  const { session, isAuthStateLoading } = useAuthSubscription({
    unprotectedRoutes: ["/"],
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
