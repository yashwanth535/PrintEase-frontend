import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../../components/user/header"
import { useNavigate } from "react-router-dom";

const defaultUserData = {
  email: "",
  orders: [],
  favourites: [],
  logs: [],
  notifications: [],
  createdAt: ""
};

const UserProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(defaultUserData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        setUserData({ ...defaultUserData, ...data.user });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const getUnreadNotificationsCount = () => {
    return userData.notifications.filter(notif => !notif.read).length;
  };

  const getRecentActivity = () => {
    return userData.logs.slice(-5); // Show last 5 logs
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <main className="max-w-4xl mt-32 mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-xl border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">User Profile</h2>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Active User
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <fieldset className="border rounded p-4">
              <legend className="font-semibold text-gray-700">Account Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium">Email</span>
                  <span className="text-gray-800">{userData.email || "-"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium">Member Since</span>
                  <span className="text-gray-800">{formatDate(userData.createdAt)}</span>
                </div>
              </div>
            </fieldset>

            {/* Statistics */}
            <fieldset className="border rounded p-4">
              <legend className="font-semibold text-gray-700">Account Statistics</legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{userData.orders.length}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{userData.favourites.length}</div>
                  <div className="text-sm text-gray-600">Favourites</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{getUnreadNotificationsCount()}</div>
                  <div className="text-sm text-gray-600">Unread Notifications</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{userData.logs.length}</div>
                  <div className="text-sm text-gray-600">Activity Logs</div>
                </div>
              </div>
            </fieldset>

            {/* Recent Notifications */}
            <fieldset className="border rounded p-4">
              <legend className="font-semibold text-gray-700">Recent Notifications</legend>
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {userData.notifications.length > 0 ? (
                  userData.notifications.slice(-5).reverse().map((notification, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-300' 
                        : 'bg-blue-50 border-blue-400'
                    }`}>
                      <div className="flex justify-between items-start">
                        <p className="text-gray-800 text-sm">{notification.message}</p>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.read && (
                        <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          New
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No notifications yet</p>
                )}
              </div>
            </fieldset>

            {/* Recent Activity */}
            <fieldset className="border rounded p-4">
              <legend className="font-semibold text-gray-700">Recent Activity</legend>
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {getRecentActivity().length > 0 ? (
                  getRecentActivity().reverse().map((log, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-gray-800 text-sm">{log.message}</p>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </fieldset>

            {/* Quick Actions */}
            <fieldset className="border rounded p-4">
              <legend className="font-semibold text-gray-700">Quick Actions</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <button
                  onClick={() => navigate("/u/home")}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  View Orders
                </button>

                <button
                  onClick={() => navigate("/u/favourites")}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  View Favourites
                </button>

                <button className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  Mark All Read
                </button>
              </div>
            </fieldset>

            {/* Account Health */}
            <fieldset className="border rounded p-4">
              <legend className="font-semibold text-gray-700">Account Status</legend>
              <div className="mt-4 flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Account Active</span>
                </div>
                <div className="text-sm text-green-600">
                  All systems operational
                </div>
              </div>
            </fieldset>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserProfile;