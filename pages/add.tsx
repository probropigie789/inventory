import { supabase } from "@/Database/uiClient";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  ArrowLeftSquare,
  CircleDashed,
  FilesIcon,
  LogOut,
  LogOutIcon,
  Search,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
export default function Add() {
  const [loading, setLoading] = useState(false);
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [year, setYear] = useState("");
  const [maker, setMaker] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");

  // get authcontext session context api

  let { session, isAuthStateLoading } = useContext(AuthContext);

  function notify(message: string, success: boolean) {
    if (success) {
      toast.success(message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
  }

  const handleAddCar = () => {
    setLoading(true);
    if (!vin || !licensePlate || !year || !maker || !model || !color) {
      notify("Please fill all the fields", false);
      return;
    }

    fetch("/api/add-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vin: vin,
        licensePlate: licensePlate,
        year: year,
        maker: maker,
        model: model,
        color: color,
        email: session?.user?.email,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        let { data, error } = result;
        if (error) {
          notify(error, false);
          return;
        }
        setVin("");
        setLicensePlate("");
        setYear("");
        setMaker("");
        setModel("");
        setColor("");
        notify("Car added successfully", true);
      });
  };

  return (
    <div className="relative h-screen flex flex-col items-center text-white bg-slate-900">
      <div className="p-6 w-full flex flex-col md:flex-row justify-between  gap-4">
        <button
          onClick={() => {
            window.location.href = "/lookup";
          }}
          className="p-2 rounded-full border-2 border-white w-max mr-auto"
        >
          <Search size={18} strokeWidth={1} color="white" />
        </button>
        <div className="flex items-center gap-4">
          <div>
            <UserCircle size={42} strokeWidth={1} />
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

      <div className="w-full bg-slate-800 p-8 border shadow-lg rounded-md mt-auto mb-auto max-w-[90vw] md:max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Add Car Entry
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              VIN
            </label>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="Enter VIN"
              required
              className="mt-1 block w-full px-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              License Plate
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="Enter License Plate"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-700 outline-none rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter Year"
              required
              className="mt-1 block w-full px-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Maker
            </label>
            <input
              type="text"
              value={maker}
              onChange={(e) => setMaker(e.target.value)}
              placeholder="Enter Maker"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-700 rounded-md outline-none shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Enter Model"
              required
              className="mt-1 block w-full px-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Enter Color"
              required
              className="mt-1 block w-full px-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
            />
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleAddCar}
            className="w-full py-2 px-4 bg-blue-600  text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
          >
            {loading ? (
              <CircleDashed
                size={24}
                strokeWidth={3}
                color="white"
                className="animate-spin m-auto"
              />
            ) : (
              "Add Car"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
