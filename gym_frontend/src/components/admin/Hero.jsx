// components/Hero.jsx
import { motion } from "framer-motion";
import {
  FiUsers,
  FiUser,
  FiDollarSign,
  FiClock,
  FiBarChart2,
  FiPieChart,
  FiCalendar,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";
import { Bar, Pie, Line } from "react-chartjs-2";

const Hero = ({ membersData, paymentData, scheduleData }) => {
  // Stats data
  const stats = [
    {
      title: "Total Members",
      value: 245,
      icon: <FiUsers size={24} />,
      change: "+12%",
    },
    {
      title: "Active Staff",
      value: 15,
      icon: <FiUser size={24} />,
      change: "+2",
    },
    {
      title: "Monthly Revenue",
      value: "$12,345",
      icon: <FiDollarSign size={24} />,
      change: "+8%",
    },
    {
      title: "Upcoming Classes",
      value: 7,
      icon: <FiClock size={24} />,
      change: "Today",
    },
  ];

  // Recent activities data
  const activities = [
    {
      id: 1,
      user: "John Doe",
      action: "New membership",
      time: "2 min ago",
      icon: <FiUser />,
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Payment received",
      time: "15 min ago",
      icon: <FiCreditCard />,
    },
    {
      id: 3,
      user: "Trainer Mike",
      action: "Added new class",
      time: "1 hour ago",
      icon: <FiClock />,
    },
    {
      id: 4,
      user: "System",
      action: "Maintenance update",
      time: "3 hours ago",
      icon: <FiSettings />,
    },
  ];

  return (
    <>
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-green-500 text-sm mt-1">{stat.change}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="flex items-center mb-4">
            <FiBarChart2 className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Members Growth</h2>
          </div>
          <Bar data={membersData} options={{ responsive: true }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="flex items-center mb-4">
            <FiPieChart className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Payment Status</h2>
          </div>
          <Pie data={paymentData} options={{ responsive: true }} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow"
      >
        <div className="flex items-center mb-4">
          <FiCalendar className="text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Weekly Schedule</h2>
        </div>
        <Line data={scheduleData} options={{ responsive: true }} />
      </motion.div>

      {/* Recent Activities Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-lg shadow mt-6"
      >
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                {activity.icon}
              </div>
              <div>
                <p className="font-medium">{activity.user}</p>
                <p className="text-gray-600 text-sm">{activity.action}</p>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Hero;
