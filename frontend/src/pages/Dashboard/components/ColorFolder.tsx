import React from "react";

const COLORS = [
  "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
  "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500",
  "bg-pink-500", "bg-gray-500"
];

interface ColorFolderProps {
  onSelect: (color: string) => void;
}

const ColorFolder: React.FC<ColorFolderProps> = ({ onSelect }) => {
  return (
    <div className="absolute top-full left-0 mt-2 grid grid-cols-5 gap-2 bg-white border border-gray-200 p-2 rounded shadow-lg z-50">
      {COLORS.map((color, idx) => (
        <div
          key={idx}
          className={`${color} w-6 h-6 rounded-full cursor-pointer`}
          onClick={() => onSelect(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorFolder;
