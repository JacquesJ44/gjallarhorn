import React from "react";
import { Landmark, Hotel } from "lucide-react";

const BuildingCard = ({ building, status, lastvalue, message, timestamp }) => {
  // Determine states
  const isUp = status?.includes("✅");
  const isDown = status?.toLowerCase().includes("❌");
  const isPaused = status?.toLowerCase().includes("⏸️");

  let iconColor, cardBg;

  if (isPaused) {
    iconColor = "text-blue-500";
    cardBg = "bg-blue-50";
  } else if (isUp) {
    iconColor = "text-green-500";
    cardBg = "bg-green-50";
  } else if (isDown) {
    iconColor = "text-red-500";
    cardBg = "bg-red-50";
  } else {
    iconColor = "text-gray-500";
    cardBg = "bg-gray-50";
  }

  // const iconColor = isUp ? "text-green-500" : "text-red-500";
  // const cardBg = isUp ? "bg-green-50" : "bg-red-50";

  // Extract simple text from message HTML
  const parseMessage = (msg) => {
    if (!msg) return "";
    const div = document.createElement("div");
    div.innerHTML = msg;
    return div.textContent || div.innerText || "";
  };

  const extractBuilding = (building) => {
  if (!building) return "";
  const parts = building.split("-");
  let name = parts.length >= 3 ? parts[1] : building;

  // Make it presentable: split numbers from letters and capitalize
  // Example: "6ono" -> "6 on O"
  name = name.replace(/([0-9]+)([a-z]+)/i, (_, num, letters) => {
    // Split letters individually and capitalize the last one
    const splitLetters = letters.slice(0, -1) + " " + letters.slice(-1).toUpperCase();
    return `${num} ${splitLetters}`;
  });

  return name;
};
  return (
    <div
      className={`flex flex-col items-center justify-center w-48 h-48 p-4 rounded-2xl shadow-md ${cardBg} transition-transform transform hover:scale-105`}
    >
      <Landmark className={`w-16 h-16 ${iconColor}`} />
      <h3 className="mt-3 text-lg font-semibold text-gray-800 text-center">
        {extractBuilding(building)}
      </h3>
      <p className="text-sm text-gray-600">{status}</p>
      {/* <p className="text-sm text-gray-600">{lastvalue}</p> */}
      {/* <p className="text-sm text-gray-600">{parseMessage(message)}</p> */}
      <p className="text-[10px] text-gray-500">
        Last Updated: {timestamp}</p>
    </div>
  );
};

export default BuildingCard;
