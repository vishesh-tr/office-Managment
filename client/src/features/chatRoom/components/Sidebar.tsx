import { Hash, Plus, Users } from "lucide-react";
import React from "react";

interface SidebarProps {
  username: string;
  rooms: string[];
  currentRoom: string;
  onlineUsers: string[];
  onJoinRoom: (room: string) => void;
  onNewRoomClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  username,
  rooms,
  currentRoom,
  onlineUsers,
  onJoinRoom,
  onNewRoomClick,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          💬 Chat Rooms
        </h1>
        <p className="text-sm text-gray-600 mt-1">Welcome, {username}!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-700 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Rooms
          </h2>
          <button
            onClick={onNewRoomClick}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="space-y-1">
          {rooms.map((room) => (
            <button
              key={room}
              onClick={() => onJoinRoom(room)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${currentRoom === room
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              # {room}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Online ({onlineUsers.length})
        </h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {onlineUsers.map((user, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">{user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
