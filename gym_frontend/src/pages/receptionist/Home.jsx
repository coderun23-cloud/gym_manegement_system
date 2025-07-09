import { useState, useEffect } from "react";
import NavBar from "./NavBar";

function Home_Receptionist() {
  // State management
  const [allMembers, setAllMembers] = useState([]);
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState({
    members: true,
    plans: true,
    submit: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    start: "",
    end: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    plan_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, members: true, plans: true }));
        const token = localStorage.getItem("token");

        // Fetch members
        const membersResponse = await fetch(`/api/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!membersResponse.ok) {
          throw new Error(`Failed to fetch members: ${membersResponse.status}`);
        }

        const membersData = await membersResponse.json();
        const membersArray = Array.isArray(membersData)
          ? membersData
          : membersData.data || [];
        setAllMembers(membersArray);

        // Fetch plans
        const plansResponse = await fetch("/api/plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!plansResponse.ok) {
          throw new Error(`Failed to fetch plans: ${plansResponse.status}`);
        }

        const plansData = await plansResponse.json();
        const plansArray = Array.isArray(plansData)
          ? plansData
          : plansData.data || [];
        setPlans(plansArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, members: false, plans: false }));
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever search term, date filter, or allMembers changes
  useEffect(() => {
    const filtered = allMembers.filter((member) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        member.name?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.phone_number?.includes(searchTerm) ||
        member.membership?.status?.toLowerCase().includes(searchLower);

      // Date filter
      let matchesDate = true;
      if (dateFilter.start || dateFilter.end) {
        const memberDate = new Date(
          member.membership?.start_date || member.created_at
        );
        const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
        const endDate = dateFilter.end ? new Date(dateFilter.end) : null;

        if (startDate && memberDate < startDate) matchesDate = false;
        if (endDate && memberDate > endDate) matchesDate = false;
      }

      return matchesSearch && matchesDate;
    });

    setDisplayedMembers(filtered);
    setCurrentPage(1);
  }, [allMembers, searchTerm, dateFilter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle member selection - auto-fill user details
  const handleMemberSelect = (memberId) => {
    const selectedMember = allMembers.find(
      (member) => member.id === parseInt(memberId)
    );
    if (selectedMember) {
      setFormData((prev) => ({
        ...prev,
        user_id: memberId,
        first_name: selectedMember.first_name || "",
        last_name: selectedMember.last_name || "",
        email: selectedMember.email || "",
        phone: selectedMember.phone_number || "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));
    setError(null);
    setSuccess(null);
    setFormErrors({});

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 422 && data.errors) {
          setFormErrors(data.errors);
          throw new Error("Please fix the form errors");
        }
        // Handle membership conflict
        if (response.status === 409) {
          throw new Error(
            data.message || "User already has a membership for this month"
          );
        }
        throw new Error(data.message || "Payment processing failed");
      }

      if (data.checkout_url) {
        // Redirect to payment page
        window.location.href = data.checkout_url;
      } else {
        setSuccess("Membership added successfully!");
        setShowModal(false);
        // Refresh members data
        const membersResponse = await fetch(`/api/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const membersData = await membersResponse.json();
        setAllMembers(
          Array.isArray(membersData) ? membersData : membersData.data || []
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Handle date filter changes
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter({ start: "", end: "" });
  };

  // Pagination logic
  const totalPages = Math.ceil(displayedMembers.length / itemsPerPage);
  const paginatedMembers = displayedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate loading state
  const isLoading = loading.members || loading.plans;

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header with search and add button */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Member Management
            </h1>
            <button
              onClick={() => setShowModal(true)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap disabled:opacity-50"
            >
              Add Membership
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Members
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, email, or phone..."
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gray-100 px-3 rounded-r-md border border-l-0 border-gray-300"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Membership Date
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="start"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  value={dateFilter.start}
                  onChange={handleDateFilterChange}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  name="end"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  value={dateFilter.end}
                  onChange={handleDateFilterChange}
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>{success}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Members Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membership Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedMembers.length > 0 ? (
                      paginatedMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {member.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  #{member.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {member.email || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.phone_number || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {member.membership?.start_date
                                ? new Date(
                                    member.membership.start_date
                                  ).toLocaleDateString()
                                : "N/A"}
                              {" to "}
                              {member.membership?.end_date
                                ? new Date(
                                    member.membership.end_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {member.membership?.status || ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.membership?.plan?.price
                              ? `${member.membership.plan.price} ETB`
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {member.membership?.plan?.name || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          {searchTerm || dateFilter.start || dateFilter.end
                            ? "No members match your filters"
                            : "No members available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * itemsPerPage,
                            displayedMembers.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {displayedMembers.length}
                        </span>{" "}
                        members
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          &laquo;
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          &lsaquo;
                        </button>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          &rsaquo;
                        </button>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          &raquo;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Membership Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Membership
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Member
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleMemberSelect(e.target.value);
                  }}
                  className={`w-full px-3 py-2 border rounded shadow appearance-none ${
                    formErrors.user_id ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Select a member</option>
                  {allMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
                {formErrors.user_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.user_id}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Plan
                </label>
                {plans.length > 0 ? (
                  <select
                    name="plan_id"
                    value={formData.plan_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded shadow appearance-none ${
                      formErrors.plan_id ? "border-red-500" : ""
                    }`}
                    required
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.price} ETB ({plan.duration_days}{" "}
                        days)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-red-500 text-sm py-2">
                    No plans available. Please add plans first.
                  </p>
                )}
                {formErrors.plan_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.plan_id}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded shadow ${
                    formErrors.first_name ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.first_name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded shadow ${
                    formErrors.last_name ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.last_name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded shadow ${
                    formErrors.email ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded shadow ${
                    formErrors.phone ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormErrors({});
                    setError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading.submit || plans.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading.submit ? "Processing..." : "Process Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home_Receptionist;
