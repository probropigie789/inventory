import { supabase } from "@/Database/uiClient";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  AlertCircle,
  CircleDashed,
  Home,
  Link,
  LogOut,
  Search,
  UserCircle,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

const AdminPage = () => {
  let { session, userData, isAdmin, isAuthStateLoading } =
    useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("is_admin", true);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      if (data) {
        setUsers(data);
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const toggleUserAttribute = async (userId: string, attribute: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, [attribute]: !user[attribute] };
      }
      return user;
    });
    setUsers(updatedUsers);

    const { error } = await supabase
      .from("users")
      .update({
        [attribute]: !users.find((user) => user.id === userId)[attribute],
      })
      .eq("id", userId);

    if (error) {
      console.error(error);
      // Optionally revert the optimistic update if the call fails
      setUsers(users);
    }
  };

  if (isAuthStateLoading || !userData) {
    return (
      <div className="relative h-dvh flex flex-col items-center justify-center text-white bg-slate-900 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircleDashed
            size={64}
            strokeWidth={1}
            color="white"
            className="animate-spin"
          />
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="relative h-dvh flex flex-col items-center justify-center text-white bg-slate-900 overflow-hidden">
        <p className="text-white text-2xl font-bold m-4 text-center mt-auto">
          You are not authorized to view this page
        </p>
        <p className="text-white text-sm font-bold m-4 text-center mb-auto">
          You need to be an admin to view this page
        </p>
        <span>
          <AlertCircle size={64} strokeWidth={1} color="white" />
        </span>

        <button
          onClick={() => {
            window.location.href = "/lookup";
          }}
          className="p-2 rounded-full border-2 font-extrabold flex gap-4 mt-auto mb-auto"
        >
          Go to Home Page
          <Home size={24} strokeWidth={2} color="green" opacity={0.7} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-dvh flex flex-col items-center text-white bg-slate-900 overflow-hidden">
      <div className="p-6 w-full flex flex-col md:flex-row justify-between gap-4">
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

      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a user by email"
          className="w-[90vw] md:w-[40vw] lg:w-[30vw] pl-10 pr-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
        />
      </div>

      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircleDashed
            size={64}
            strokeWidth={1}
            color="white"
            className="animate-spin"
          />
        </div>
      )}

      {users.filter((user) => user.email.includes(query)).length === 0 &&
        !loading && (
          <div className="flex items-center gap-4 m-8">
            <AlertCircle size={42} strokeWidth={1} />
            <p className="text-white">No users found</p>
          </div>
        )}
      <div className="overflow-auto w-[90vw] md:w-[40vw] lg:w-[30vw flex flex-col gap-4 m-4 md:pr-4">
        {users
          .filter((user) => user.email.includes(query))
          .map((user) => (
            <div
              key={user.id}
              className="flex flex-col p-2 w-full mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4">
                <UserCircle size={42} strokeWidth={1} />
                <p className="text-white font-semibold">{user.email}</p>
              </div>
              <div className="flex items-center gap-4 my-2">
                <Link size={24} strokeWidth={1} />
                <p className="text-gray-400">{user.id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
                <div className="flex items-center justify-between border border-[#83838370] p-2">
                  <p className="text-white mr-2">Approved</p>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.is_approved}
                      onChange={() =>
                        toggleUserAttribute(user.id, "is_approved")
                      }
                      className="form-checkbox h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between border border-[#83838370] p-2">
                  <p className="text-white mr-2">Add Entry Permission</p>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.can_add}
                      onChange={() => toggleUserAttribute(user.id, "can_add")}
                      className="form-checkbox h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between border border-[#83838370] p-2">
                  <p className="text-white mr-2">View Permission</p>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.can_view}
                      onChange={() => toggleUserAttribute(user.id, "can_view")}
                      className="form-checkbox h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between border border-[#83838370] p-2">
                  <p className="text-white mr-2">Delete Permission</p>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.can_delete}
                      onChange={() =>
                        toggleUserAttribute(user.id, "can_delete")
                      }
                      className="form-checkbox h-5 w-5 text-blue-600 transition duration-200 ease-in-out"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminPage;
