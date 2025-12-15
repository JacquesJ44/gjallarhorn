import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import BuildingCard from "./BuildingCard";

const BuildingMap = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 120000); // refresh every 2 minutes
    return () => clearInterval(interval);
  }, []);
  
  const fetchSensors = async () => {
    try {
      const response = await axios.get("/api/status");
      // console.log("Fetching sensors", response.data);
      const sensorsArray = Object.entries(response.data || {}).map(
        ([building, data]) => ({
          building,
          ...data,
        })
      );
      setSensors(sensorsArray);
      // console.log("Sensorarray", sensorsArray);
    } catch (err) {
      console.error("Error fetching sensors:", err);
      setSensors([]);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      {/* Header */}
      <header className="w-full max-w-6xl bg-[#00274d] text-white p-6 rounded-lg shadow-md flex justify-center">
        <img
          src="https://aesirsystems.co.za/wp-content/uploads/2023/10/logo_black-aesir-e1698304582122.png"
          alt="Aesir Systems Logo"
          className="max-h-16"
        />
      </header>
        <h2 className="text-2xl dark:text-black font-bold mt-10">Network Status Monitor</h2>

      {/* Grid of BuildingCards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full max-w-6xl">
        {sensors.map((sensor, idx) => (
          <BuildingCard key={idx} {...sensor} />
        ))}
      </div>
    </div>





  );
};

export default BuildingMap;
