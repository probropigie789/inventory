import { supabase } from "@/Database/uiClient";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bold,
  BoldIcon,
  CircleDashed,
  LogOut,
  Plus,
  PlusCircle,
  Search,
  Trash,
  UserCircle,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "react-toastify";

export default function Lookup() {
  const [page, setPage] = useState<number>(1);
  const [cars, setCars] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [text, setText] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);

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

  async function deleteCar(id: any) {
    fetch("/api/delete-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body.data);
        const currentCars = [...cars];
        // filter out a car by id
        const filteredCars = currentCars.filter((car) => car.id !== id);
        setCars([...filteredCars]);
        notify("Successfully Deleted", true);
        setRefresh(!refresh);
      });
  }

  useEffect(() => {
    setLoading(true);
    fetch("/api/get-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: page,
        text: text,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body.data);
        setCars(body.data.cars);
        setTotalPages(body.data.maxPages === 0 ? 1 : body.data.maxPages);
        setCount(body.data.totalCount);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, refresh]);

  useEffect(() => {
    // flushSync(() => {});

    setPage(1);
    setTimeout(() => {
      setRefresh(!refresh);
    }, 0); // Defer to the next event loop cycle
  }, [text]);

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="relative h-dvh flex flex-col items-center text-white bg-slate-900 overflow-hidden">
      <div className="p-6 w-full flex flex-col gap-4 md:flex-row md:justify-between">
        <button
          onClick={() => {
            window.location.href = "/add";
          }}
          className="p-2 rounded-full shadow-md border-2 border-green-700 w-max mr-auto"
        >
          <Plus size={18} strokeWidth={2} color="green" />
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
            className="p-2 rounded-full border-2 font-extrabold border-red-700"
          >
            <LogOut size={18} strokeWidth={2} color="red" />
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search for entry with VIN or License Plate"
          className="w-[90vw]  md:w-[40vw] lg:w-[30vw] pl-10 pr-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
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

      {!loading && !cars.length && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <AlertCircle size={64} strokeWidth={1} color="white" />
          <p className="text-white">No entries found</p>
        </div>
      )}

      <div className="flex flex-1 overflow-auto flex-col py-4 gap-6 w-full mt-4">
        {!loading &&
          cars.map((car) => (
            <div
              key={car.id}
              className="flex flex-col p-4 w-[90vw] md:w-[50%] mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-md "
            >
              <div className="grid  gap-4">
                <div className="flex justify-start text-base font-bold text-blue-300">
                  <span className="w-1/5">VIN:</span>
                  <span className="w-1/5 text-gray-200">{car.VIN}</span>
                </div>

                <div className="flex justify-start text-base font-bold text-blue-300">
                  <span className="w-1/5">License Plate:</span>
                  <span className="text-gray-200">{car.LicensePlate}</span>
                </div>

                <div className="flex justify-start text-base font-bold text-blue-300">
                  <span className="w-1/5">Year:</span>
                  <span className="text-gray-200">{car.Year}</span>
                </div>

                <div className="flex justify-start text-base font-bold text-blue-300">
                  <span className="w-1/5">Maker:</span>
                  <span className="text-gray-200">{car.Maker}</span>
                </div>

                <div className="flex justify-start text-base font-bold text-blue-300">
                  <span className="w-1/5">Model:</span>
                  <span className="text-gray-200">{car.Model}</span>
                </div>

                <div className="flex justify-start text-base font-bold text-blue-300">
                  <span className="w-1/5">Color:</span>
                  <span className="text-gray-200">{car.Color}</span>
                </div>
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={async () => {
                    await deleteCar(car.id);
                  }}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-200 shadow flex ml-auto gap-2 items-center"
                >
                  <p>Delete</p>
                  <Trash size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="my-4 flex gap-4">
        <ArrowLeft
          size={22}
          strokeWidth={2}
          color={page > 1 ? "white" : "gray"}
          className="cursor-pointer"
          onClick={handlePrev}
        />
        <div>
          <p>
            Page {page} of {totalPages}
          </p>
        </div>
        <ArrowRight
          size={22}
          strokeWidth={2}
          color={page < totalPages ? "white" : "gray"}
          className="cursor-pointer"
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
