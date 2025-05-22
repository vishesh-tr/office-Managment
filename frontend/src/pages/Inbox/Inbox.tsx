import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead,
  clearAllNotifications,
  deleteNotification,
} from "./inboxSlice";
import Navbar from "../../layouts/Navbar";
import Sidebar from "../../layouts/Sidebar";
import { MoreVertical } from "lucide-react";

const Inbox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { notifications, status } = useSelector((state: RootState) => state.inbox);
  const { projects } = useSelector((state: RootState) => state.projects);
  const hasMarkedAllRead = useRef(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (!hasMarkedAllRead.current && notifications.length > 0) {
      dispatch(markAllAsRead());
      hasMarkedAllRead.current = true;
    }
  }, [notifications, dispatch]);

  const handleNotificationClick = (notification: any) => {
    dispatch(markNotificationAsRead(notification.id));
    if (notification.projectId) {
      navigate(`/project/${notification.projectId}`, {
        state: {
          color: notification.projectColor,
          short: projects.find((p) => p._id === notification.projectId)?.short || "",
        },
      });
    }
  };

  const handleDeleteNotification = (id: string) => {
    dispatch(deleteNotification(id));
    setOpenMenuId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar projects={projects} sidebarOpen={true} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 px-4 py-8 sm:px-8 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Inbox</h1>
              <p className="text-gray-500 mt-1">All your notifications in one place</p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={() => dispatch(clearAllNotifications())}
                className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded hover:bg-red-200 transition"
              >
                Delete All
              </button>
            )}
          </div>

          {status === "loading" ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {notifications.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`relative group p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-4">
                        {notification.projectColor && (
                          <div
                            className={`${notification.projectColor} h-10 w-10 flex items-center justify-center rounded-md flex-shrink-0`}
                          >
                            <span className="text-white text-sm font-bold">
                              {notification.projectTitle?.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                        )}

                        {/* Context menu */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId((prev) => (prev === notification.id ? null : notification.id));
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          <MoreVertical size={18} />
                          {openMenuId === notification.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-6 top-12 z-10 bg-white border border-gray-200 rounded-md shadow-md"
                            >
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <img
                    src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png"
                    alt="No notifications"
                    className="w-24 h-24 mb-4 opacity-50"
                  />
                  <p className="text-gray-600">No notifications yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
