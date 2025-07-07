import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

function Profile() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [staffMembers, setStaffMembers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const navigate = useNavigate();

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 50, opacity: 0 },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone_number: userData.phone_number || "",
            address: userData.address || "",
          });

          // Fetch staff members if admin
          if (userData.role === "admin") {
            const staffRes = await fetch("/api/staff", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (staffRes.ok) {
              setStaffMembers(await staffRes.json());
            }
          }
        } else {
          setMessage({ text: "Failed to fetch profile.", type: "error" });
        }
      } catch (error) {
        console.log(error);
        setMessage({ text: "Network error occurred.", type: "error" });
      }
    };

    if (token) fetchProfile();
  }, [token]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        user.role === "customer" ? `/api/customer/${user.id}` : "/api/profile";

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setShowEditModal(false);
      } else {
        setMessage({ text: "Failed to update profile.", type: "error" });
      }
    } catch (error) {
      console.log(error);
      setMessage({ text: "Network error occurred.", type: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (res.ok) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
      } else if (res.status === 403) {
        setMessage({ text: "Incorrect password.", type: "error" });
      } else {
        setMessage({ text: "Failed to delete account.", type: "error" });
      }
    } catch (error) {
      console.log(error);
      setMessage({ text: "Network error occurred.", type: "error" });
    } finally {
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  const addStaffMember = async (staffData) => {
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(staffData),
      });

      if (res.ok) {
        const newStaff = await res.json();
        setStaffMembers([...staffMembers, newStaff]);
        setMessage({ text: "Staff member added!", type: "success" });
        setShowStaffModal(false);
      } else {
        setMessage({ text: "Failed to add staff member.", type: "error" });
      }
    } catch (error) {
      console.log(error);
      setMessage({ text: "Network error occurred.", type: "error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg cursor-pointer mb-8 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back
        </motion.button>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">
                  {formData.name}
                </h2>
                <p className="text-indigo-600 font-medium">
                  {user?.role === "admin" ? "buyer" : "seller"}
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                  Delete
                </motion.button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg text-gray-800">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <PhoneIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="text-lg text-gray-800">
                    {formData.phone_number || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <HomeIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-lg text-gray-800">
                    {formData.address || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="text-lg text-gray-800 capitalize">
                    {user?.role || "user"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Staff Management Section (for admins) */}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Edit Profile
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-red-600">
                    Confirm Account Deletion
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <p className="mb-6 text-gray-700">
                  This action cannot be undone. All your data will be
                  permanently deleted. Please enter your password to confirm.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDelete}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showStaffModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Add New Staff Member
                  </h3>
                  <button
                    onClick={() => setShowStaffModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addStaffMember({
                      name: e.target.name.value,
                      email: e.target.email.value,
                      role: e.target.role.value,
                    });
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setShowStaffModal(false)}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add Staff
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Profile;
