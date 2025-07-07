import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const Plan = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Plan state management
  const [plans, setPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_days: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Fetch plans when component mounts or page changes
  useEffect(() => {
    fetchPlans();
  }, [currentPage]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/plans?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
        }
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans(data.data.data);
      setLastPage(data.data.last_page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editId ? `/api/plans/${editId}` : "/api/plans";
      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      setIsModalOpen(false);
      setEditId(null);
      setFormData({
        name: "",
        price: "",
        duration_days: "",
        description: "",
      });
      fetchPlans();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      duration_days: plan.duration_days,
      description: plan.description,
    });
    setEditId(plan.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/plans/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Delete failed");
        }

        fetchPlans();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          <h1 className="text-2xl font-bold mb-6">Plans Management</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            onClick={() => {
              setEditId(null);
              setFormData({
                name: "",
                price: "",
                duration_days: "",
                description: "",
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Add New Plan
          </button>

          {loading && !isModalOpen ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Price</th>
                      <th className="py-2 px-4 border-b">Duration (Days)</th>
                      <th className="py-2 px-4 border-b">Description</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.id}>
                        <td className="py-2 px-4 border-b">{plan.name}</td>
                        <td className="py-2 px-4 border-b">{plan.price}</td>
                        <td className="py-2 px-4 border-b">
                          {plan.duration_days}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {plan.description}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {lastPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage >= lastPage}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Modal for Add/Edit */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {editId ? "Edit Plan" : "Add New Plan"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="price">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="duration_days"
                    >
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      id="duration_days"
                      name="duration_days"
                      value={formData.duration_days}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Plan;
