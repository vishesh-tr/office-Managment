import React from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onRename: () => void;
  onMoveToBin: () => void;
  onOrganise: () => void;
  showColorDropdown: boolean;
  onColorSelect: (color: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onRename,
  onMoveToBin,
  onOrganise,
  showColorDropdown,
  onColorSelect,
}) => {
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 250);

  const handleClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  const colors = [
    "bg-orange-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-pink-500",
  ];

  return (
    <div
      className="fixed z-50"
      style={{ top: adjustedY, left: adjustedX }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-md shadow-lg border border-gray-200 w-48 py-1">
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
          onClick={(e) => handleClick(e, onRename)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Rename
        </button>

        <div className="relative">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            onClick={(e) => handleClick(e, onOrganise)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            Change Color
          </button>

          {showColorDropdown && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-md shadow-lg border border-gray-200 p-2 w-32">
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`${color} h-6 w-6 rounded cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColorSelect(color);
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-1"></div>

        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
          onClick={(e) => handleClick(e, onMoveToBin)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Move to Bin
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;