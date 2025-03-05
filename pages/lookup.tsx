import { supabase } from "@/Database/uiClient";

type Car = {
  id: number;
  VIN: string;
  LicensePlate: string;
  Year: number;
  Maker: string;
  Model: string;
  Color: string;
  location: string;
  price: number;
  lot: string;
  user: string;
  is_deleted: boolean;
  image: string[];
};
import { AuthContext } from "@/Providers/AuthProvider";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDashed,
  LogOut,
  Plus,
  Search,
  Trash,
  UserCircle,
  X,
  XIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

function CarsTable({
  cars,
  isAdmin,
  userData,
  loading,
  onDeleteCar,
}: {

  cars: Car[];
  isAdmin: boolean;
  userData: any;
  loading: boolean;
  onDeleteCar: (id: any) => void;
  }) {
 
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedCarIndex, setSelectedCarIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState<Record<number, number>>({});

  const handleImageChange = (carIndex: number, direction: "prev" | "next") => {
    setImageIndex((prev) => {
      const currentIndex = prev[carIndex] || 0;
      if (!cars[carIndex]?.image) return prev;

      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % cars[carIndex].image.length
          : (currentIndex - 1 + cars[carIndex].image.length) %
          cars[carIndex].image.length;

      return { ...prev, [carIndex]: newIndex };
    });
  };

  const handleDelete = (carId: number) => {
    onDeleteCar(carId);
    setSelectedCar(null); // Close the modal after delete
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <table className="w-[80vw] text-left border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-blue-300">
            {[
              "VIN",
              "License Plate",
              "Year",
              "Maker",
              "Model",
              isAdmin ? "Deleted" : null,
              "Submitted By",
            ]
              .filter(Boolean)
              .map((header, index) => (
                <th key={header} className="border-r border-gray-700 p-2">
                  {header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {isAdmin || userData.can_view
            ? cars?.map((car, index) => (
              <tr
                key={car.id}
                className="cursor-pointer hover:bg-gray-700 border border-gray-700"
                onClick={() => {
                  setSelectedCar(car);
                  setSelectedCarIndex(index);
                }}
              >
                <td className="p-2 border-r border-gray-700 max-w-[150px] overflow-hidden text-ellipsis">
                  {car.VIN}
                </td>
                <td className="p-2 border-r border-gray-700 max-w-[150px] overflow-hidden text-ellipsis">
                  {car.LicensePlate}
                </td>
                <td className="p-2 border-r border-gray-700 max-w-[100px] overflow-hidden text-ellipsis">
                  {car.Year}
                </td>
                <td className="p-2 border-r border-gray-700 max-w-[150px] overflow-hidden text-ellipsis">
                  {car.Maker}
                </td>
                <td className="p-2 border-r border-gray-700 max-w-[150px] overflow-hidden text-ellipsis">
                  {car.Model}
                </td>
                {isAdmin && (
                  <td className="p-2 border-r border-gray-700 max-w-[100px] overflow-hidden text-ellipsis">
                    {car.is_deleted ? <Check /> : <XIcon />}
                  </td>
                )}
                <td className="p-2 max-w-[150px] overflow-hidden text-ellipsis">
                  {car.user}
                </td>
              </tr>
            ))
            : null}
        </tbody>
      </table>


      {selectedCar && selectedCarIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCar(null);
          }}
        >
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-white text-base p-1 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => setSelectedCar(null)}
            >
             <X size={18} color="white" />
            </button>


            {/* Image Section */}
            {selectedCar.image && selectedCar.image.length > 0 && (
              <div className="relative">
                <img
                  src={selectedCar.image[imageIndex[selectedCarIndex] || 0]}
                  alt={selectedCar.Model}
                  className="max-h-[200px] w-full object-contain border-4 border-gray-700 bg-gray-900 p-4 md:p-2 rounded-lg"
                />
                <div className="absolute top-1/2 left-2 -translate-y-1/2">
                  <button
                    onClick={() => handleImageChange(selectedCarIndex, "prev")}
                    className="p-2 rounded-full border border-gray-500 hover:bg-gray-600"
                  >
                    <ArrowLeft size={20} color="white" />
                  </button>
                </div>
                <div className="absolute top-1/2 right-2 -translate-y-1/2">
                  <button
                    onClick={() => handleImageChange(selectedCarIndex, "next")}
                    className="p-2 rounded-full border border-gray-500 hover:bg-gray-600"
                  >
                    <ArrowRight size={20} color="white" />
                  </button>
                </div>
              </div>
            )}
            {/* Car Details */}
            <div className="grid mt-6 p-2 gap-4">
              {[
                { label: "VIN", value: selectedCar.VIN },
                { label: "License Plate", value: selectedCar.LicensePlate },
                { label: "Year", value: selectedCar.Year },
                { label: "Maker", value: selectedCar.Maker },
                { label: "Model", value: selectedCar.Model },
                { label: "Color", value: selectedCar.Color },
                { label: "Location", value: selectedCar.location },
                { label: "Price", value: selectedCar.price },
                { label: "Lot", value: selectedCar.lot },
                selectedCar?.user ? { label: "Submitted By", value: selectedCar.user } : null,
                isAdmin ? { label: "Deleted", value: selectedCar.is_deleted ? <Check /> : <XIcon /> } : null,
              ]
                .filter((item) => item !== null) // Explicitly filter out null values
                .map(({ label, value }, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-start text-sm md:text-base font-bold text-blue-300"
                  >
                    <span className="w-full md:w-1/5">{label}:</span>
                    <span className="w-full md:w-1/5 text-gray-200">{value}</span>
                  </div>
                ))}
            </div>

            {/* Delete Button */}
            {(userData.can_delete || isAdmin) && (
              <div className="p-2 mt-2">
                <button
                  onClick={() => handleDelete(selectedCar.id)}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-200 shadow flex ml-auto gap-2 items-center"
                >
                  <Trash size={18} strokeWidth={2} />
                  <p>Delete</p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function DeletedCarsTable({
  deletedCars,
  isAdmin,
  loading,
}: {

  deletedCars: Car[];
  isAdmin: boolean;
  loading: boolean;
  }) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedCarIndex, setSelectedCarIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState<Record<number, number>>({});

  const handleImageChange = (carIndex: number, direction: "prev" | "next") => {
    setImageIndex((prev) => {
      const currentIndex = prev[carIndex] || 0;
      let newIndex;

      if (!deletedCars[carIndex]?.image) return prev;

      newIndex =
        direction === "next"
          ? (currentIndex + 1) % deletedCars[carIndex].image.length
          : (currentIndex - 1 + deletedCars[carIndex].image.length) %
          deletedCars[carIndex].image.length;

      return { ...prev, [carIndex]: newIndex };
    });
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <table className="w-[80vw] text-left border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-blue-300">
            {[
              "VIN",
              "License Plate",
              "Year",
              "Maker",
              "Model",
              "Submitted By",
            ].map((header) => (
              <th key={header} className="border border-gray-700 p-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isAdmin &&
            !loading &&
            deletedCars?.map((car, index) => (
              <tr
                key={car.id}
                className="cursor-pointer hover:bg-gray-700 border border-gray-700"
                onClick={() => {
                  setSelectedCar(car);
                  setSelectedCarIndex(index);
                }}
              >
                <td className="p-2">{car.VIN}</td>
                <td className="p-2">{car.LicensePlate}</td>
                <td className="p-2">{car.Year}</td>
                <td className="p-2">{car.Maker}</td>
                <td className="p-2">{car.Model}</td>
                <td className="p-2">{car.user}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {selectedCar && selectedCarIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCar(null);
          }}
        >
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setSelectedCar(null)}
            >
              <X size={24} color="white" />
            </button>
            {selectedCar.image && selectedCar.image.length > 0 && (
              <div className="relative">
                <img
                  src={selectedCar.image[imageIndex[selectedCarIndex] || 0]}
                  alt={selectedCar.Model}
                  className="w-full object-contain max-h-60 border-4 border-gray-700 bg-gray-900 p-2 rounded-lg"
                />
                <button
                  onClick={() => handleImageChange(selectedCarIndex, "prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full border border-gray-500 hover:bg-gray-600"
                >
                  <ArrowLeft size={20} color="white" />
                </button>
                <button
                  onClick={() => handleImageChange(selectedCarIndex, "next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full border border-gray-500 hover:bg-gray-600"
                >
                  <ArrowRight size={20} color="white" />
                </button>
              </div>
            )}
            <div className="mt-4 text-blue-300">
              <p><strong>VIN:</strong> {selectedCar.VIN}</p>
              <p><strong>License Plate:</strong> {selectedCar.LicensePlate}</p>
              <p><strong>Year:</strong> {selectedCar.Year}</p>
              <p><strong>Maker:</strong> {selectedCar.Maker}</p>
              <p><strong>Model:</strong> {selectedCar.Model}</p>
              <p><strong>Color:</strong> {selectedCar.Color}</p>
              <p><strong>Location:</strong> {selectedCar.location}</p>
              <p><strong>Price:</strong> {selectedCar.price}</p>
              <p><strong>Lot:</strong> {selectedCar.lot}</p>
              <p><strong>Submitted By:</strong> {selectedCar.user}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function Lookup() {
  const [page, setPage] = useState<number>(1);
  const [cars, setCars] = useState<any[]>([]);
  const [deletedCars, setDeletedCars] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [text, setText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "deleted">("all");
  const [imageIndex, setImageIndex] = useState<{ [key: number]: number }>({});

  const { session, userData, isAdmin, isAuthStateLoading } =
    useContext(AuthContext);

  const notify = (message: string, success: boolean) => {
    toast[success ? "success" : "error"](message, {
      position: "bottom-center",
      autoClose: 3000,
    });
    setLoading(false);
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber: page, text, isAdmin }),
      });

      if (!response.ok) throw new Error("Failed to fetch entries.");

      const body = await response.json();
      setCars(body.data.cars || []);
      setTotalPages(body.data.maxPages || 1);
      setLoading(false); // Ensure loading is set to false after fetching
    } catch (error) {
      console.error("Error fetching entries:", error);
      setLoading(false); // Set loading to false in case of an error
      notify("Error loading entries. Please try again.", false);
    }
  };

  const fetchDeletedCars = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const response = await fetch("/api/get-deleted-cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber: page, text, isAdmin }),
      });

      console.log("response", response);

      if (!response.ok) throw new Error("Failed to fetch deleted cars.");

      const body = await response.json();
      setDeletedCars(body.data.cars || []);
      setTotalPages(body.data.maxPages || 1);
      setLoading(false); // Ensure loading is set to false after fetching
    } catch (error) {
      console.error("Error fetching deleted cars:", error);
      notify("Error loading deleted cars. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id: any) => {
    try {
      const response = await fetch("/api/delete-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete car.");

      const body = await response.json();
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
      notify("Successfully Deleted", true);
    } catch (error) {
      console.error("Error deleting car:", error);
      notify("Error deleting the car. Please try again.", false);
    }
  };

  const handleImageChange = (carIndex: number, direction: "prev" | "next") => {
    setImageIndex((prevState) => {
      const currentIndex = prevState[carIndex] || 0;
      const imagesCount = cars[carIndex]?.image.length || 1;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % imagesCount
          : (currentIndex - 1 + imagesCount) % imagesCount;
      return { ...prevState, [carIndex]: newIndex };
    });
  };

  useEffect(() => {
    console.log("deleted cars", deletedCars);
  }, [deletedCars]);

  useEffect(() => {
    if (activeTab === "all") fetchEntries();
    else fetchDeletedCars();
  }, [page, text, isAdmin, activeTab]);

  const handleTabChange = (tab: "all" | "deleted") => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  if (isAuthStateLoading || !userData) {
    return (
      <div className="relative h-dvh flex items-center justify-center text-white bg-slate-900">
        <CircleDashed
          size={64}
          strokeWidth={1}
          color="white"
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="relative h-dvh flex flex-col items-center text-white bg-slate-900 overflow-hidden">
      <div className="p-6 w-full flex flex-col gap-4 md:flex-row md:justify-between">
        <button
          onClick={() => (window.location.href = "/add")}
          className="p-2 rounded-full shadow-md border-2 border-green-700 w-max mr-auto"
        >
          <Plus size={20} strokeWidth={2} color="green" />
        </button>
        <div className="flex mt-2 md:mt-0 items-center gap-4">
          <UserCircle
            size={42}
            strokeWidth={1}
            className="cursor-pointer"
            onClick={() => (window.location.href = "/profile")}
          />
          <p className="text-white">{session?.user?.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="p-2 rounded-full border-2 font-extrabold border-red-700"
          >
            <LogOut size={18} strokeWidth={2} color="red" />
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="flex justify-center gap-4 mt-4 mb-2">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "all" ? "bg-blue-600" : "bg-gray-700"
            } text-white`}
          >
            All Cars
          </button>
          <button
            onClick={() => handleTabChange("deleted")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "deleted" ? "bg-blue-600" : "bg-gray-700"
            } text-white`}
          >
            Deleted Cars
          </button>
        </div>
      )}

      {(userData.can_view || isAdmin) && activeTab === "all" && (
        <div className="relative mt-2 flex items-center">
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

      {(userData.can_view || isAdmin) && activeTab === "deleted" && (
        <div className="relative mt-2 flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search for deleted entry with VIN or License Plate"
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

      {!loading && activeTab === "all" && !cars.length && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <AlertCircle size={64} strokeWidth={1} color="white" />
          <p className="text-white">No entries found</p>
        </div>
      )}

      <div className="flex flex-1 overflow-auto flex-col py-4 gap-6 w-full mt-2">
        {!isAdmin && userData.can_view === false && !loading && (
          <div className="flex flex-col p-2 max-w-[90vw] mx-auto bg-gray-800 border border-gray-700 rounded-3xl shadow-md my-auto">
            <div className="flex justify-center text-base font-bold text-blue-300">
              <p className="text-white">
                You do not have permission to view entries
              </p>
            </div>
          </div>
        )}

        {(isAdmin || userData.can_view) && !loading && activeTab === "all" && (
          <CarsTable
            cars={cars.filter((car) => !car.is_deleted)} // Exclude deleted cars
            isAdmin={isAdmin}
            userData={userData}
            loading={loading}
            onDeleteCar={deleteCar}
          />
        )}

        {isAdmin &&
          !loading &&
          activeTab === "deleted" &&
          deletedCars.length > 0 && (
            <>
              <DeletedCarsTable
                deletedCars={deletedCars}
                isAdmin={isAdmin}
                loading={loading}
              />  
            </>
          )}

      {/* Pagination */}
      {(userData.can_view || isAdmin) && (
        <div className="my-4 flex gap-4 mx-auto mt-auto">
          <ArrowLeft
            size={22}
            strokeWidth={2}
            color={page > 1 ? "white" : "gray"}
            className="cursor-pointer"
            onClick={handlePrev}
          />
          <p>
            Page {page} of {totalPages}
          </p>
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
    </div>
  );
}
