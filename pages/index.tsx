import { supabase } from "@/Database/uiClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Car } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen text-white bg-slate-900">
      <div className="flex justify-between w-full p-4 text-white bg-slate-900">
        <div className="flex items-center gap-2">
          <Car size={50} strokeWidth={1} />
          <p className="text-2xl font-bold">Cars-Inventory</p>
        </div>
      </div>

      <div className="block w-[90%] md:w-[400px] min-w-[max-content] m-auto bg-slate-900 p-5 border border-gray-500 rounded-lg">
        <Auth
          socialLayout="vertical"
          view="sign_in"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  inputText: "white",
                  inputLabelText: "white",
                  anchorTextColor: "white",
                },
              },
            },
          }}
          supabaseClient={supabase}
          providers={[]}
        />
      </div>
    </div>
  );
}
