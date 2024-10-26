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
  const [imageIndex, setImageIndex] = useState<number[]>([]);

  let { session, userData, isAdmin, isAuthStateLoading } =
    useContext(AuthContext);

  const handleNextImage = (carIndex: number) => {
    let currentCar = cars[carIndex];
    if (imageIndex[carIndex] < currentCar.image.length-1) {
      let temp = [...imageIndex];
      let currentIndex = imageIndex[carIndex];
      temp[carIndex] = currentIndex + 1;
      setImageIndex(temp);
    }
  };

  const handlePrevImage = (carIndex: number) => {
    let currentCar = cars[carIndex];
    if (imageIndex[carIndex] > 0) {
      let temp = [...imageIndex];
      let currentIndex = imageIndex[carIndex];
      temp[carIndex] = currentIndex - 1;
      setImageIndex(temp);
    }
  };

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
        setPage(1);
        setTimeout(() => {
          setRefresh(!refresh);
        }, 0); // Defer to the next event loop cycle
      });
  }

  useEffect(() => {
    if (cars && cars.length > 0) {
      let size = cars.length;
      let array = Array(size).fill(0);
      setImageIndex(array);
    }
  },[cars])

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
    <div className="relative h-dvh flex flex-col items-center text-white bg-slate-900 overflow-hidden">
      <div className="p-6 w-full flex flex-col gap-4 md:flex-row md:justify-between">
        <button
          onClick={() => {
            window.location.href = "/add";
          }}
          className="p-2 rounded-full shadow-md border-2 border-green-700 w-max mr-auto"
        >
          <Plus size={20} strokeWidth={2} color="green" />
        </button>
        <div className="flex mt-2 md:mt-0 items-center gap-4">
          <div>
            <UserCircle
              size={42}
              strokeWidth={1}
              className="cursor-pointer"
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
            className="p-2 rounded-full border-2 font-extrabold border-red-700"
          >
            <LogOut size={18} strokeWidth={2} color="red" />
          </button>
        </div>
      </div>

      {(userData.can_view || isAdmin) && (
        <div className="relative mt-4 flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search for entry with VIN or License Plate"
            className="w-[90vw] md:w-[40vw] lg:w-[30vw] pl-10 pr-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
          />
        </div>
      )}

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

      <div className="flex flex-1 overflow-auto  flex-col py-4 gap-6 w-full mt-2">
        {!isAdmin && userData.can_view === false && !loading && (
          <div className="flex flex-col p-2 max-w-[90vw] mx-auto bg-gray-800 border border-gray-700 rounded-3xl shadow-md my-auto">
            <div className="flex justify-center text-base font-bold text-blue-300">
              <p className="text-white">
                You do not have permission to view entries
              </p>
            </div>
          </div>
        )}

        {(isAdmin || userData.can_view) &&
          !loading &&
          cars.map((car, carIndex) => (
            <div
              key={car.id}
              className="flex mt-4 md:mt-0 flex-col p-2 w-[90vw] md:w-[50%] mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-md "
            >
              {car?.image && Array.isArray(car.image) && car.image.length > 0 && (
                <div className="relative">
                  <img
                    key={carIndex}
                    src={car.image[imageIndex[carIndex]]}
                    alt={`Car ${carIndex + 1} Image ${imageIndex[carIndex] + 1}`}
                    className="max-h-[170px] md:max-h-[280px] w-full md:w-full object-contain border-4 border-gray-700 bg-gray-900 p-4 md:p-2 rounded-lg mx-auto"
                  />
                  <div className="pl-5 md:pl-8 absolute top-1/2 left-0 transform -translate-y-1/2">
                    <button
                      onClick={() => handlePrevImage(carIndex)}
                      className="p-2 rounded-full border border-gray-500 hover:bg-gray-600"
                    >
                      <ArrowLeft size={20} color="white" />
                    </button>
                  </div>
                  <div className="pr-5 absolute top-1/2 right-0 transform -translate-y-1/2">
                    <button
                      onClick={() => handleNextImage(carIndex)}
                      className="p-2 rounded-full border border-gray-500 hover:bg-gray-600"
                    >
                      <ArrowRight size={20} color="white" />
                    </button>
                  </div>
                </div>

              )}

              <div className="grid mt-4 p-2 gap-4">
                {[
                  { label: "VIN", value: car.VIN },
                  { label: "License Plate", value: car.LicensePlate },
                  { label: "Year", value: car.Year },
                  { label: "Maker", value: car.Maker },
                  { label: "Model", value: car.Model },
                  { label: "Color", value: car.Color },
                  { label: "Location", value: car.location },
                  { label: "Price", value: car.price },
                  car?.email && { label: "Entry Submitted By", value: car.email }
                ].filter(Boolean).map(({ label, value }, index) => (
                  <div key={index} className="flex flex-row md:flex-row justify-start text-sm md:text-base font-bold text-blue-300">
                    <span className="w-full md:w-1/5">{label}:</span>
                    <span className="w-full md:w-1/5 text-gray-200">{value}</span>
                  </div>
                ))}
              </div>


              {(userData.can_delete || isAdmin) && (
                <div className="p-2 mt-2">
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
              )}
            </div>
          ))}
      </div>

      {(userData.can_view || isAdmin) && (
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
      )}
    </div>
  );
}
