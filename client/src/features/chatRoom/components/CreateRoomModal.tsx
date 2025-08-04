import React, { ChangeEvent, KeyboardEvent } from "react";

interface CreateRoomModalProps {
  show: boolean;
  roomName: string;
  onClose: () => void;
  onCreate: () => void;
  setRoomName: (name: string) => void;
  handleKeyPress: (e: KeyboardEvent<HTMLInputElement>, action: () => void) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  show,
  roomName,
  onClose,
  onCreate,
  setRoomName,
  handleKeyPress,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-2xl max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New Room</h3>
        <input
          type="text"
          placeholder="Room name"
          value={roomName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRoomName(e.target.value)
          }
          onKeyDown={(e) => handleKeyPress(e, onCreate)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={!roomName.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
