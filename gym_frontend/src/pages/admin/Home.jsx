// AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import Headers from "../../components/admin/Headers";
import Sidebar from "../../components/admin/Sidebar";
import Hero from "../../components/admin/Hero";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const HomeAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, start with sidebar closed
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Chart data
  const membersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Members",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const paymentData = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(255, 99, 132, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const scheduleData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Classes Scheduled",
        data: [5, 7, 8, 6, 9, 4, 2],
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        location={location}
      />

      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "ml-64" : "ml-0"
        }`}
      >
        <Headers toggleSidebar={toggleSidebar} />

        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Dashboard Overview
          </h1>

          <Hero
            membersData={membersData}
            paymentData={paymentData}
            scheduleData={scheduleData}
          />
        </main>
      </div>
    </div>
  );
};

export default HomeAdmin;
