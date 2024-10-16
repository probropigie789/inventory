import { useState } from "react";

export default function Add() {
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [year, setYear] = useState("");
  const [maker, setMaker] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");

  const handleAddCar = () => {
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
      }),
    });
  };

  return (
    <div className="relative h-screen flex items-center justify-center text-white bg-slate-900">
      <div className="absolute top-0 right-0 p-6">
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <div>
              <img
                src="/profile.png"
                alt="User Icon"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div>
              <p className="text-white">inventory@gmail.com</p>
            </div>
          </div>
          <button className="py-2 px-4 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-400">
            Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-md bg-gray-800 p-8 border shadow-lg rounded-md">
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
            onClick={handleAddCar}
            className="w-full py-2 px-4 bg-blue-600  text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
