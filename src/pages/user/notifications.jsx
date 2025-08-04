import { useEffect, useState } from "react";
import UserHeader from "../../components/user/header";
import { FaBell, FaHistory } from "react-icons/fa";

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

  const Section = ({ icon: Icon, title, items }) => (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        <Icon /> {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No {title.toLowerCase()}.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="border border-gray-200 dark:border-gray-800 rounded px-4 py-2 text-sm bg-white dark:bg-gray-900 flex justify-between">
              <span>{item.message}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <UserHeader />
      <main className="max-w-4xl mx-auto px-4 py-10 mt-32">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : (
          <>
            <Section icon={FaBell} title="Notifications" items={notifications} />
            <Section icon={FaHistory} title="Activity Logs" items={logs} />
          </>
        )}
      </main>
    </div>
  );
};

export default Notifications;
