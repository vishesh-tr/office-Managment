import { useChat } from "../../hooks/useChat";
import ChatArea from "./components/ChatArea";
import CreateRoomModal from "./components/CreateRoomModal";
import Sidebar from "./components/Sidebar";

const Chat = () => {
  const {
    messagesMap,
    message,
    setMessage,
    rooms,
    currentRoom,
    username,
    setUsername,
    isUsernameSet,
    showNewRoomDialog,
    setShowNewRoomDialog,
    newRoomName,
    setNewRoomName,
    onlineUsers,
    sendMessage,
    joinRoom,
    createRoom,
    handleUsernameSubmit,
    handleKeyPress,
  } = useChat();

  if (!isUsernameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Chat</h1>
            <p className="text-gray-600">Enter your username to start chatting</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleUsernameSubmit)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleUsernameSubmit}
              disabled={!username.trim()}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        username={username}
        rooms={rooms}
        currentRoom={currentRoom}
        onlineUsers={onlineUsers}
        onJoinRoom={joinRoom}
        onNewRoomClick={() => setShowNewRoomDialog(true)}
      />

      <ChatArea
        messages={messagesMap[currentRoom] || []}
        currentRoom={currentRoom}
        message={message}
        username={username}
        setMessage={setMessage}
        onSendMessage={sendMessage}
        onKeyPress={handleKeyPress}
      />

      <CreateRoomModal
        show={showNewRoomDialog}
        roomName={newRoomName}
        onClose={() => {
          setShowNewRoomDialog(false);
          setNewRoomName("");
        }}
        onCreate={createRoom}
        setRoomName={setNewRoomName}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default Chat;
