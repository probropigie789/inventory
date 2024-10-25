import { supabase } from "@/Database/uiClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function getNextRoute(
  event: AuthChangeEvent,
  session: Session | null,
  currentPath: string,
  unprotectedRoutes: string[]
): string {
  let next = "";

  // If the current path is an unprotected route, stay on the current path
  // If the current path is the error page, stay on the current path
  if (unprotectedRoutes.includes(currentPath) || currentPath === "/_error") {
    return currentPath;
  }

  // Determine the next route based on the auth event
  console.log("event", event);
  console.log("session", session);
  console.log("currentPath", currentPath);

  switch (event) {
    case "INITIAL_SESSION":
      // If there's a session, and the current path is "/", redirect to the dashboard, otherwise stay on the current path
      // If there's no session, redirect to "/"
      next = session ? (currentPath === "/" ? "/lookup" : currentPath) : "/";
      break;
    case "TOKEN_REFRESHED":
      next = session ? (currentPath === "/" ? "/lookup" : currentPath) : "/";
      break;
    case "SIGNED_IN":
      next = currentPath === "/" ? "/lookup" : currentPath;
      break;
    case "SIGNED_OUT":
      next = "/";
      break;
  }

  return next;
}

export default function useAuthSubscription({
  unprotectedRoutes = [],
}: {
  unprotectedRoutes: string[];
}) {
  const router = useRouter();
  const [nextRoute, setNextRoute] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unprotected, setUnprotected] = useState(unprotectedRoutes);

  useEffect(() => {
    setIsLoading(true);
    const authState = supabase.auth.onAuthStateChange((event, session) => {
      const nextRoutePath = getNextRoute(
        event,
        session,
        window.location.pathname,
        unprotected
      );
      setNextRoute(nextRoutePath);
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      authState.data.subscription.unsubscribe();
      setIsLoading(false);
    };
  }, [router, unprotected]);

  useEffect(() => {
    if (nextRoute !== "" && router.pathname !== nextRoute && !isLoading) {
      // Redirect to the next route if it's not the current route and the auth state is not loading
      router.push(nextRoute);
    }
  }, [nextRoute, router, isLoading]);

  return {
    session,
    isAuthStateLoading: isLoading,
  };
}
