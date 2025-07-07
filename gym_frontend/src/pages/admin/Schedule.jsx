import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Headers from "../../components/admin/Headers";
import Sidebar from "../../components/admin/Sidebar";
import { AppContext } from "../../context/AppContext";
import { format, parseISO } from "date-fns";

const Schedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { token } = useContext(AppContext);

  // State for schedules
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State for trainers and members
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Initial form state
  const initialFormData = {
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    trainer_id: "",
    member_id: "",
  };

  // Form data
  const [formData, setFormData] = useState(initialFormData);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/schedules", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }

        const data = await response.json();
        setSchedules(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSchedules();
    }
  }, [token]);

  // Fetch trainers and members
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch trainers using your endpoint
        const trainersResponse = await fetch("/api/trainer", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!trainersResponse.ok) {
          throw new Error("Failed to fetch trainers");
        }

        const trainersData = await trainersResponse.json();
        setTrainers(trainersData.trainer); // Note we're using .trainer here to match your API response

        // Rest of your code for fetching members...
        const membersResponse = await fetch("/api/members", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!membersResponse.ok) {
          throw new Error("Failed to fetch members");
        }

        const membersData = await membersResponse.json();
        setMembers(membersData.data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add new schedule
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create schedule");
      }

      setSchedules((prev) => [...prev, data.schedule]);
      setSuccess("Schedule created successfully!");
      setShowAddModal(false);
      setFormData(initialFormData); // Reset form
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit schedule
  const handleEditSchedule = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update schedule");
      }

      setSchedules((prev) =>
        prev.map((s) => (s.id === selectedSchedule.id ? data.schedule : s))
      );
      setSuccess("Schedule updated successfully!");
      setShowEditModal(false);
      setFormData(initialFormData); // Reset form
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete schedule
  const handleDeleteSchedule = async () => {
    try {
      const response = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete schedule");
      }

      setSchedules((prev) => prev.filter((s) => s.id !== selectedSchedule.id));
      setSuccess("Schedule deleted successfully!");
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Set form data for editing
  const setupEditForm = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      title: schedule.title,
      description: schedule.description || "",
      start_time: format(parseISO(schedule.start_time), "yyyy-MM-dd'T'HH:mm"),
      end_time: format(parseISO(schedule.end_time), "yyyy-MM-dd'T'HH:mm"),
      trainer_id: schedule.trainer_id,
      member_id: schedule.member_id,
    });
    setShowEditModal(true);
  };

  // Reset form when opening add modal
  const openAddModal = () => {
    setFormData(initialFormData);
    setShowAddModal(true);
  };

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-dismiss alerts
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        location={location}
      />

      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "ml-64" : "ml-0"
        }`}
      >
        <Headers toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Schedules</h2>
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add New Schedule
              </button>
            </div>

            {/* Error/Success Alerts */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Schedules Table */}
            {loading ? (
              <div className="text-center py-5">Loading schedules...</div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-5">No schedules found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trainer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {schedule.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {schedule.trainer?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {schedule.member?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(
                            parseISO(schedule.start_time),
                            "MMM d, yyyy h:mm a"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(
                            parseISO(schedule.end_time),
                            "MMM d, yyyy h:mm a"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => setupEditForm(schedule)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setShowDeleteModal(true);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Add Schedule Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Add New Schedule</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddSchedule}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">End Time *</label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Trainer *</label>
                  <select
                    name="trainer_id"
                    value={formData.trainer_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.id}>
                        {trainer.name}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Member *</label>
                  <select
                    name="member_id"
                    value={formData.member_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Schedule Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Edit Schedule</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleEditSchedule}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">End Time *</label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Trainer *</label>
                  <select
                    name="trainer_id"
                    value={formData.trainer_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Member *</label>
                  <select
                    name="member_id"
                    value={formData.member_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Delete Schedule</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <p className="mb-4">
                Are you sure you want to delete this schedule?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSchedule}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
