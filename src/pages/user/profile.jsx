import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User,Mail, Edit2,ShoppingBag, Heart, Bell, Activity, CheckCircle, Home, Star, Check } from "lucide-react";
import toast from "react-hot-toast";

const defaultUserData = {
  email: "",
  orders: [],
  favourites: [],
  logs: [],
  notifications: [],
  createdAt: "",
  name:"",
  phone:""
};

const UserProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isEditing, setIsEditing] = useState(false);
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

const updateInfo = async (editedData) => {
  try {
    const response = await fetch(`${API_URL}/api/user/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(editedData)
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to get error message from response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile");
      } else {
        // If HTML or other non-JSON response
        toast.error(`Server error: ${response.status} ${response.statusText}`);
      }
      return;
    }
    
    const data = await response.json();
    
    if (data.success) {
      setUserData({ ...userData, ...editedData });
      toast.success("Profile updated successfully!");
    } else {
      toast.error(data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Network error. Please try again.");
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

  const [editedData, setEditedData] = useState({
  name: userData.name || "",
  phone: userData.phone || ""
});

const handleEdit = () => {
  setIsEditing(true);
  setEditedData({
    name: userData.name || "",
    phone: userData.phone || ""
  });
};

const handleCancel = () => {
  setIsEditing(false);
  setEditedData({
    name: userData.name || "",
    phone: userData.phone || ""
  });
};

const handleSave = () => {
  updateInfo(editedData);
  setIsEditing(false);
};

  if (loading) {
    return (
      <div className="min-h-screen minimal-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-6xl mx-auto px-4 py-8 pt-24 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="feature-card floating p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <User size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    User Profile
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage your account and view activity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                  <CheckCircle size={16} />
                  Active User
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Top Section - Account Info & Statistics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Account Information */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Account Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Name</p>
                      {!isEditing && (
                        <button onClick={handleEdit} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <Edit2 size={16} />
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200">{userData.name || "-"}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone</p>
                      {!isEditing && (
                        <button onClick={handleEdit} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <Edit2 size={16} />
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData.phone}
                        onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200">{userData.phone || "-"}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</p>
                    <p className="text-slate-800 dark:text-slate-200">{userData.email || "-"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Member Since</p>
                    <p className="text-slate-800 dark:text-slate-200">{formatDate(userData.createdAt)}</p>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
              {/* Account Status */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Account Status</h3>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="font-medium text-emerald-800 dark:text-emerald-400">Account Active</span>
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">
                    All systems operational
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Statistics Grid */}
            <motion.div 
              className="feature-card floating p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-slate-600 dark:text-slate-400" size={20} />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Account Statistics</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl text-center border border-blue-200 dark:border-blue-800">
                  <ShoppingBag className="mx-auto mb-3 text-blue-600 dark:text-blue-400" size={24} />
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userData.orders.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Orders</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6 rounded-xl text-center border border-emerald-200 dark:border-emerald-800">
                  <Heart className="mx-auto mb-3 text-emerald-600 dark:text-emerald-400" size={24} />
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{userData.favourites.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Favourites</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 rounded-xl text-center border border-amber-200 dark:border-amber-800">
                  <Bell className="mx-auto mb-3 text-amber-600 dark:text-amber-400" size={24} />
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{getUnreadNotificationsCount()}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Unread Notifications</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl text-center border border-purple-200 dark:border-purple-800">
                  <Activity className="mx-auto mb-3 text-purple-600 dark:text-purple-400" size={24} />
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userData.logs.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Activity Logs</div>
                </div>
              </div>
            </motion.div>

            {/* Middle Section - Notifications & Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Recent Notifications */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Recent Notifications</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userData.notifications.length > 0 ? (
                    userData.notifications.slice(-5).reverse().map((notification, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        notification.read 
                          ? 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600' 
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
                      }`}>
                        <div className="flex justify-between items-start">
                          <p className="text-slate-800 dark:text-slate-200 text-sm">{notification.message}</p>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        {!notification.read && (
                          <span className="inline-block mt-2 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            New
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">No notifications yet</p>
                  )}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Recent Activity</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {getRecentActivity().length > 0 ? (
                    getRecentActivity().reverse().map((log, index) => (
                      <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="text-slate-800 dark:text-slate-200 text-sm">{log.message}</p>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">No recent activity</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div 
              className="feature-card floating p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Star className="text-slate-600 dark:text-slate-400" size={20} />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/u/home")}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Home size={18} />
                  View Orders
                </button>

                <button
                  onClick={() => navigate("/u/favourites")}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Heart size={18} />
                  View Favourites
                </button>

                <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                  <Check size={18} />
                  Mark All Read
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserProfile;