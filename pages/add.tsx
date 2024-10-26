import { supabase } from "@/Database/uiClient";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  AlertCircle,
  ArrowLeftSquare,
  CheckCircle,
  CircleDashed,
  FilesIcon,
  LogOut,
  LogOutIcon,
  Search,
  UserCircle,
  XCircle,
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
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<string>(
    Math.random().toString(36).substring(7)
  );

  // get authcontext session context api

  let { session, isAuthStateLoading, userData, isAdmin } =
    useContext(AuthContext);

  function generateRandomImageFileName(length: number) {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result;
  }

  const removeFile = async (index: any) => {
    const fileName = fileUrls[index].split("/").pop();
    if (!fileName) return;
    setFileLoading(true);
    const { data, error } = await supabase.storage
      .from("assets")
      .remove([fileName]);
    if (error) {
      return;
    }
    setFileUrls(fileUrls.filter((_, i) => i !== index));
    setFileName(null);
    setFileLoading(false);
    setFileInputKey(generateRandomImageFileName(20).join(""));
  };

  const uploadFile = async (event: any) => {
    const file = event?.target?.files[0];
    if (!file) return;

    setFileLoading(true);

    const bucket = "assets";

    // if already a file is uploaded, remove it
    if (fileName) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);
    }

    let ext = file.name.split(".").pop();
    let newFileName = generateRandomImageFileName(20).join("") + "." + ext;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(newFileName, file);

    if (error) {
      notify("Error uploading file", false);
      setFileLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(newFileName);

    setFileUrls([...fileUrls, urlData.publicUrl]);
    setFileName(newFileName);
    setFileLoading(false);
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

  const handleAddCar = () => {
    setLoading(true);
    if (
      !vin ||
      !licensePlate ||
      !year ||
      !maker ||
      !model ||
      !color ||
      !location ||
      !price
    ) {
      notify("Please fill all the fields", false);
      return;
    }

    if (!fileUrls) {
      notify("Please include an image for the entry", false);
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
        location: location,
        image: fileUrls,
        price: price,
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
        setLocation("");
        setPrice("");
        setFileUrls([]);
        setFileName(null);
        setFileInputKey(generateRandomImageFileName(20).join(""));

        notify("Car added successfully", true);
      });
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

      {!isAdmin && userData.can_add === false && (
        <div className="flex flex-col p-2 max-w-[90vw] mx-auto bg-gray-800 border border-gray-700 rounded-3xl shadow-md my-auto">
          <div className="flex justify-center text-base font-bold text-blue-300">
            <p className="text-white">
              You do not have permission to add entries
            </p>
          </div>
        </div>
      )}

      {(isAdmin || userData.can_add) && (
        <div className="w-full bg-slate-800 p-8 border shadow-lg rounded-md mt-auto mb-auto max-w-[90vw] md:max-w-[40vw]">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Add Car Entry
          </h1>
          <form className="space-y-4 w-full">
            <div className="md:flex w-full">
              <div className="min-w-[50%] md:pr-4 mb-4 flex flex-col gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter Location"
                    required
                    className="mt-1 block w-full px-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Price
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter Price"
                    required
                    className="mt-1 block w-full px-3 py-2 border outline-none border-gray-500 bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <label className="block ml-4 text-sm font-medium text-gray-300">
                    Image
                  </label>
                  {fileLoading && (
                    <CircleDashed
                      size={16}
                      strokeWidth={3}
                      color="white"
                      className="animate-spin"
                    />
                  )}
                </div>
                <div className="ml-4 ">
                  <input
                    type="file"
                    key={fileInputKey}
                    accept="image/*"
                    onChange={uploadFile}
                    className="mt-1 block w-[316px] px-2 py-2 border outline-none border-gray-500 bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                    disabled={fileUrls.length >= 8}
                  />
                  <div className="flex gap-2 flex-wrap mt-2">
                    {fileUrls.map((url, index) => (
                      <div key={index} className="relative w-[100px] h-[100px]">
                        <XCircle
                          size={20}
                          color="red"
                          onClick={() => removeFile(index)}
                          className="cursor-pointer absolute top-1 right-1"
                        />
                        <img src={url} alt="car" className="w-full h-full object-cover rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={loading || fileLoading}
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
      )}
    </div>
  );
}
