import { useEffect, useState } from "react";

import { supabase } from "@/Database/uiClient";

export default function useUserDataSync(session: {
  user: {
    id: any;
    email: any;
  };
}) {
  const [userData, setUserData] = useState<{
    id: any;
    email: any;
    can_view: boolean;
    can_add: boolean;
    can_delete: boolean;
    is_approved: boolean;
    is_admin: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session && session.user) {
      supabase
        .from("users")
        .upsert([
          {
            id: session.user.id,
            email: session.user.email,
          },
        ])
        .eq("id", session.user.id)
        .select("*")
        .single()
        .then((res) => {
          console.log("User upserted", res);
          if (res.data) {
            setUserData(res.data);
            setIsLoading(false);
          }
        });
    }
  }, [session]);

  useEffect(() => {
    const taskListener = supabase
      .channel("user_data_sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          // @ts-ignore
          if (session && payload.new.id === session.user.id) {
            setUserData(payload.new as any);
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      taskListener.unsubscribe();
    };
  }, [session]);

  return { userData, isLoading };
}
