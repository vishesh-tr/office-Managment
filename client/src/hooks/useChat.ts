import { KeyboardEvent, useEffect, useState } from "react";
import socket from "../features/chatRoom/Socket";
import { ChatMessage } from "../features/chatRoom/types/type";

const MESSAGES_KEY = "chat-messages";

export const useChat = () => {
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [message, setMessage] = useState<string>("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>("General");
  const [username, setUsername] = useState<string>("");
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);
  const [showNewRoomDialog, setShowNewRoomDialog] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem(MESSAGES_KEY);
    if (storedMessages) {
      setMessagesMap(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesMap));
  }, [messagesMap]);

  // Setup socket listeners
  useEffect(() => {
    socket.on("message", (msg: ChatMessage) => {
      setMessagesMap((prev) => {
        const room = msg.room || "General";
        return {
          ...prev,
          [room]: [...(prev[room] || []), msg],
        };
      });
    });

    socket.on("roomsList", setRooms);

    socket.on("userJoined", ({ username, room }) => {
      const systemMsg: ChatMessage = {
        type: "system",
        message: `${username} joined the room`,
        timestamp: new Date().toLocaleTimeString(),
        room,
      };
      setMessagesMap((prev) => ({
        ...prev,
        [room]: [...(prev[room] || []), systemMsg],
      }));
    });

    socket.on("userLeft", ({ username, room }) => {
      const systemMsg: ChatMessage = {
        type: "system",
        message: `${username} left the room`,
        timestamp: new Date().toLocaleTimeString(),
        room,
      };
      setMessagesMap((prev) => ({
        ...prev,
        [room]: [...(prev[room] || []), systemMsg],
      }));
    });

    socket.on("onlineUsers", setOnlineUsers);

    socket.emit("getRooms");

    return () => {
      socket.off("message");
      socket.off("roomsList");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("onlineUsers");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && isUsernameSet) {
      const msgData: ChatMessage = {
        username,
        message: message.trim(),
        room: currentRoom,
        timestamp: new Date().toLocaleTimeString(),
        type: "user",
      };

      socket.emit("message", msgData);

      setMessagesMap((prev) => ({
        ...prev,
        [currentRoom]: [...(prev[currentRoom] || []), msgData],
      }));

      setMessage("");
    }
  };

  const joinRoom = (roomName: string) => {
    if (roomName !== currentRoom) {
      socket.emit("joinRoom", { username, room: roomName });
      setCurrentRoom(roomName);
    }
  };

  const createRoom = () => {
    const room = newRoomName.trim();
    if (room) {
      socket.emit("createRoom", { roomName: room, username });
      setRooms((prev) => [...prev, room]);
      setNewRoomName("");
      setShowNewRoomDialog(false);
      joinRoom(room);
    }
  };

  const handleUsernameSubmit = () => {
    const name = username.trim();
    if (name) {
      setIsUsernameSet(true);
      socket.emit("joinRoom", { username: name, room: currentRoom });
    }
  };

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") action();
  };

  return {
    messagesMap,
    message,
    setMessage,
    rooms,
    currentRoom,
    setCurrentRoom,
    username,
    setUsername,
    isUsernameSet,
    setIsUsernameSet,
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
  };
};
