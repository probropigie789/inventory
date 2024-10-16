import { supabase } from "@/Database/uiClient";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  ArrowLeft,
  ArrowRight,
  CircleDashed,
  LogOut,
  Plus,
  PlusCircle,
  UserCircle,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

export default function Lookup() {
  const [page, setPage] = useState<number>(1);
  const [cars, setCars] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  let { session, isAuthStateLoading } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    fetch("/api/get-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: page,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body.data);
        setCars(body.data.cars);
        setTotalPages(body.data.maxPages);
        setCount(body.data.totalCount);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

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
      <div className="p-6 w-full flex justify-between place-items-center">
        <button
          onClick={() => {
            window.location.href = "/add";
          }}
          className="p-2 rounded-full border-2 border-white"
        >
          <Plus size={18} strokeWidth={1} color="white" />
        </button>
        <div className="flex items-center gap-4">
          <div>
            <UserCircle size={42} strokeWidth={1} />
          </div>
          <div>
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

      <div className="flex gap-4">
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

      <div className="flex flex-1 overflow-auto flex-col py-4 gap-4 w-full mt-4">
        {!loading &&
          cars.map((car) => {
            return (
              <div
                key={car.id}
                className="flex flex-col gap-4 p-4 w-[90%] m-auto bg-slate-800"
              >
                <div>
                  <p>
                    <strong>VIN : </strong>
                    {car.VIN}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>License Plate : </strong>
                    {car.LicensePlate}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Year : </strong>
                    {car.Year}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Maker : </strong>
                    {car.Maker}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Model : </strong>
                    {car.Model}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Color : </strong>
                    {car.Color}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
