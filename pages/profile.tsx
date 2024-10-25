import { supabase } from "@/Database/uiClient";
import useAuthSubscription from "@/hooks/useAuthSubscription";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  AlertCircle,
  CircleDashed,
  LogOut,
  LucideUserCircle2,
  Search,
  User2Icon,
  UserCircle,
  UserRoundCheckIcon,
  UserRoundCogIcon,
  UserRoundX,
} from "lucide-react";
import React, { useContext, useEffect } from "react";

const Profile = () => {
  let { session, isAuthStateLoading, isAdmin, userData } =
    useContext(AuthContext);

  if (isAuthStateLoading || !userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900 color-white">
        <CircleDashed size={64} className="animate-spin" color="white" />;
      </div>
    );
  }

  if (userData && userData.is_approved === false && isAdmin === false) {
    return (
      <div className="relative h-dvh flex flex-col items-center justify-center text-white bg-slate-900 overflow-hidden">
        <p className="text-white text-2xl font-bold m-4 text-center mt-auto">
          Your account is pending approval, please check back later
        </p>
        <p className="text-white text-sm font-bold m-4 text-center mb-auto">
          An admin will review your account shortly
        </p>
        <span>
          <AlertCircle size={64} strokeWidth={1} color="white" />
        </span>

        <button
          onClick={() => supabase.auth.signOut()}
          className="p-2 rounded-full border-2 font-extrabold flex gap-4 mt-auto mb-auto"
        >
          Sign Out
          <LogOut size={18} strokeWidth={2} color="red" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen min-h-max pb-4 flex flex-col items-center text-white bg-slate-900">
      <div className="p-6 w-full flex flex-col md:flex-row justify-between  gap-4">
        <button
          onClick={() => {
            window.location.href = "/lookup";
          }}
          className="p-2 rounded-full border-2 border-white w-max mr-auto"
        >
          <Search size={20} strokeWidth={2} color="white" />
        </button>
        <div className="flex items-center gap-4">
          <div>
            <UserCircle
              className="cursor-pointer"
              size={42}
              strokeWidth={1}
              onClick={() => {
                window.location.href = "/profile";
              }}
            />
          </div>
          <div className="m-auto">
            <p className="text-white">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="p-2 rounded-full border-2 border-red-700"
          >
            <LogOut size={18} strokeWidth={1} color="red" />
          </button>
        </div>
      </div>
      <p className="text-2xl font-bold mt-4 text-center">Profile</p>

      {isAdmin && (
        <div className="flex flex-col items-center gap-4 bg-slate-700 p-2 px-4 rounded-md m-4 w-[90%] mx-auto md:w-max">
          <p className="text-white text-lg font-bold m-4 text-center flex gap-2 items-center">
            You have the following permissions as an admin!{" "}
            <UserRoundCogIcon size={24} strokeWidth={2} />
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-3xl">
            <div className="flex items-center gap-2 bg-slate-800 p-2 px-4 rounded-full w-max m-auto">
              <p>Can View Entries</p>
              <UserRoundCheckIcon
                size={24}
                strokeWidth={2}
                color="green"
                opacity={0.7}
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-2 px-4 rounded-full w-max m-auto">
              <p> Can Add Entries</p>
              <UserRoundCheckIcon
                size={24}
                strokeWidth={2}
                color="green"
                opacity={0.7}
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-2 px-4 rounded-full w-max m-auto">
              <p>Can Delete Entries</p>
              <UserRoundCheckIcon
                size={24}
                strokeWidth={2}
                color="green"
                opacity={0.7}
              />
            </div>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="flex flex-col items-center gap-4 bg-slate-700 p-2 px-4 rounded-md m-4 w-[90%] mx-auto md:w-max">
          <p className="text-white text-lg font-bold m-4 text-center flex gap-2 items-center">
            You have the following permissions as User!{" "}
            <User2Icon size={24} strokeWidth={2} />
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-3xl">
            <div className="flex items-center gap-2 bg-slate-800 p-2 px-4 rounded-full w-max m-auto">
              <p>
                {userData.can_view ? "Can View Entries" : "can't View Entries"}
              </p>
              {userData.can_view ? (
                <UserRoundCheckIcon
                  size={24}
                  strokeWidth={2}
                  color="green"
                  opacity={0.7}
                />
              ) : (
                <UserRoundX
                  size={24}
                  strokeWidth={2}
                  color="red"
                  opacity={0.7}
                />
              )}
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-2 px-4 rounded-full w-max m-auto">
              <p>
                {userData.can_add ? "Can Add Entries" : "can't Add Entries"}
              </p>

              {userData.can_add ? (
                <UserRoundCheckIcon
                  size={24}
                  strokeWidth={2}
                  color="green"
                  opacity={0.7}
                />
              ) : (
                <UserRoundX
                  size={24}
                  strokeWidth={2}
                  color="red"
                  opacity={0.7}
                />
              )}
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-2 px-4 rounded-full w-max m-auto">
              <p>
                {userData.can_delete
                  ? "Can Delete Entries"
                  : "can't Delete Entries"}
              </p>

              {userData.can_delete ? (
                <UserRoundCheckIcon
                  size={24}
                  strokeWidth={2}
                  color="green"
                  opacity={0.7}
                />
              ) : (
                <UserRoundX
                  size={24}
                  strokeWidth={2}
                  color="red"
                  opacity={0.7}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div
          className="flex items-center gap-4 bg-slate-800 p-2 px-4 rounded-full cursor-pointer"
          onClick={() => {
            window.location.href = "/admin";
          }}
        >
          <p>Go to the admin dashboard</p>
          <UserRoundCogIcon size={24} strokeWidth={2} />
        </div>
      )}
    </div>
  );
};

export default Profile;
