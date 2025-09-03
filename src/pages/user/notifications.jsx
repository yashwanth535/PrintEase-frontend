/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, History, AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Notifications = () => {
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/logs`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const Section = ({ icon: Icon, title, items }) => (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="feature-card floating p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl">
            <Icon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
        </div>
        
        {items.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No {title.toLowerCase()} yet.
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
              {title === 'Notifications' ? 'You\'ll see important updates here.' : 'Your activity will appear here.'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-black/60 transition-all duration-200 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {title === 'Notifications' ? getNotificationIcon(item.type) : <Clock className="h-5 w-5 text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                      {title === 'Notifications' && (
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md">
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-4xl mx-auto px-4 py-10 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <motion.h1 
              className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Notifications & Activity
            </motion.h1>
            <motion.p 
              className="text-slate-600 dark:text-slate-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stay updated with your latest notifications and activity history.
            </motion.p>
          </div>
        </motion.div>
        
        {loading ? (
          <motion.div 
            className="feature-card floating p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-6">
              <div className="animate-spin h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-400 rounded-full mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Loading your notifications...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Section icon={Bell} title="Notifications" items={notifications} />
            <Section icon={History} title="Activity Logs" items={logs} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
