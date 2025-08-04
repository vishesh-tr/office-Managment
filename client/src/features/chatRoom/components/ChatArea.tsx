import { Hash, Send } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";

interface ChatMessage {
  username?: string;
  message: string;
  room?: string;
  timestamp: string;
  type: "user" | "system";
}

interface ChatAreaProps {
  messages: ChatMessage[];
  currentRoom: string;
  message: string;
  username: string;
  setMessage: (msg: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: KeyboardEvent<HTMLInputElement>, action: () => void) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  currentRoom,
  message,
  username,
  setMessage,
  onSendMessage,
  onKeyPress,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = messages.filter(
    (msg) => msg.room === currentRoom || msg.type === "system"
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Hash className="w-5 h-5 text-indigo-600" />
          {currentRoom}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === "system" ? "justify-center" : "justify-start"
              }`}
          >
            {msg.type === "system" ? (
              <div className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                {msg.message}
              </div>
            ) : (
              <div
                className={`max-w-xs lg:max-w-md ${msg.username === username ? "ml-auto" : ""
                  }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${msg.username === username
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                    }`}
                >
                  {msg.username !== username && (
                    <div className="text-xs font-medium mb-1 text-indigo-600">
                      {msg.username}
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <div
                    className={`text-xs mt-1 ${msg.username === username
                      ? "text-indigo-200"
                      : "text-gray-500"
                      }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => onKeyPress(e, onSendMessage)}
            placeholder={`Message #${currentRoom}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={onSendMessage}
            disabled={!message.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
