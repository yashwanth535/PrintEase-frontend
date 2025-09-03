import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Package, DollarSign, CheckCircle, Clock, XCircle, FileText, Calendar, Star, Activity } from "lucide-react";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    averageOrderValue: 0,
    popularServices: [],
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/dashboard`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };


  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'pending':
        return 'text-amber-600 dark:text-amber-400';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <motion.h1 
              className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                <BarChart3 className="h-8 w-8 text-slate-700 dark:text-slate-300" />
              </div>
              Vendor Dashboard
            </motion.h1>
            <motion.p 
              className="text-slate-600 dark:text-slate-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Monitor your business performance and manage orders efficiently.
            </motion.p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-8"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="feature-card floating p-6 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Orders</h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalOrders}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Completed</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mt-1">{stats.completedOrders}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Pending</span>
                  </div>
                  <p className="text-lg font-bold text-amber-800 dark:text-amber-200 mt-1">{stats.pendingOrders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="feature-card floating p-6 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-xl">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Earnings</h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹{stats.totalEarnings}</p>
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">This Month</span>
                </div>
                <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-1">₹{stats.monthlyEarnings}</p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="feature-card floating p-6 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Order</h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹{stats.averageOrderValue}</p>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Per Order Value</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="feature-card floating p-6 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-xl">
                  <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Popular Services</h3>
                </div>
              </div>
              <div className="space-y-2">
                {stats.popularServices.length > 0 ? stats.popularServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">{service.name}</span>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-800/30 px-2 py-1 rounded-full">{service.count}</span>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <Star className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No services data yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="feature-card floating p-6 group"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                <FileText className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recent Orders</h3>
            </div>
            
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? stats.recentOrders.map((order, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-black/60 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Order #{order.id}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{order.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)} ${order.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30' : order.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">₹{order.amount}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Recent Orders</h4>
                  <p className="text-slate-500 dark:text-slate-400">Your recent orders will appear here once customers start placing orders.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard; 