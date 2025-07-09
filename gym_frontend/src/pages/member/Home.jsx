import { useState, useEffect, useContext } from "react";
import Footer from "../../components/Footer";
import NavBar from "./NavBar";
import { format, parseISO } from "date-fns";
import { AppContext } from "../../context/AppContext";

function Home_Member() {
  const [memberships, setMemberships] = useState([]);
  const [filteredMemberships, setFilteredMemberships] = useState([]);
  const [loading, setLoading] = useState({
    memberships: true,
    plans: true,
  });
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
  });
  const [filters, setFilters] = useState({
    status: "",
    plan_type: "",
    start_date: "",
    end_date: "",
  });
  const [plans, setPlans] = useState([]);
  const { token } = useContext(AppContext);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data = await res.json();
        setPlans(data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, plans: false }));
      }
    };

    fetchPlans();
  }, [token]);

  // Fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      setLoading((prev) => ({ ...prev, memberships: true }));
      try {
        const res = await fetch(
          `/api/my_memebership?page=${pagination.current_page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch memberships");
        const data = await res.json();

        const membershipsArray = Array.isArray(data)
          ? data
          : data.data
          ? data.data
          : data.id
          ? [data]
          : [];

        setMemberships(membershipsArray);
        setFilteredMemberships(membershipsArray);

        if (data.last_page) {
          setPagination((prev) => ({
            ...prev,
            last_page: data.last_page,
            per_page: data.per_page ?? prev.per_page,
          }));
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, memberships: false }));
      }
    };

    fetchMemberships();
  }, [pagination.current_page, token]);

  // Filtering logic
  useEffect(() => {
    let result = memberships;

    if (filters.status) {
      result = result.filter((m) =>
        m.status?.toLowerCase().includes(filters.status.toLowerCase())
      );
    }

    if (filters.plan_type) {
      result = result.filter(
        (m) =>
          (m.plan?.name ?? "").toLowerCase() === filters.plan_type.toLowerCase()
      );
    }

    if (filters.start_date) {
      const sd = parseISO(filters.start_date);
      result = result.filter((m) => parseISO(m.start_date) >= sd);
    }

    if (filters.end_date) {
      const ed = parseISO(filters.end_date);
      result = result.filter((m) => parseISO(m.end_date) <= ed);
    }

    setFilteredMemberships(result);
  }, [filters, memberships]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ status: "", plan_type: "", start_date: "", end_date: "" });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  // Get unique plan types from fetched plans
  const planTypes = [...new Set(plans.map((plan) => plan.type))].filter(
    Boolean
  );

  // Safe lengths
  const total = filteredMemberships.length;
  const perPage = pagination.per_page;
  const startIdx = (pagination.current_page - 1) * perPage;
  const paginated = filteredMemberships.slice(startIdx, startIdx + perPage);

  const isLoading = loading.memberships || loading.plans;

  return (
    <div>
      <NavBar />
      <main className="container mx-auto px-4 py-8 mt-25 mb-80">
        <h1 className="text-2xl font-bold mb-6">My Memberships</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* Filters */}
            <section className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-lg font-semibold mb-3">Filter Memberships</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Plan Type
                  </label>
                  <select
                    name="plan_type"
                    value={filters.plan_type}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md"
                    disabled={loading.plans}
                  >
                    <option value="">All Types</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.name}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date After
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date Before
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Reset Filters
                </button>
              </div>
            </section>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "#",
                        "Plan",
                        "Description",
                        "Status",
                        "Start Date",
                        "End Date",
                        "Price",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs uppercase text-gray-500 tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginated.length > 0 ? (
                      paginated.map((m, index) => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{index + 1}</td>

                          <td className="px-6 py-4">{m.plan?.name || "N/A"}</td>
                          <td className="px-6 py-4">
                            {m.plan?.description || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                m.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : m.status === "expired"
                                  ? "bg-red-100 text-red-800"
                                  : m.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {m.start_date
                              ? format(parseISO(m.start_date), "MMM dd, yyyy")
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {m.end_date
                              ? format(parseISO(m.end_date), "MMM dd, yyyy")
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            $
                            {m.plan?.price
                              ? parseFloat(m.plan.price).toFixed(2)
                              : "0.00"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No memberships found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <p className="text-sm">{`Showing ${startIdx + 1}-${Math.min(
                    startIdx + paginated.length,
                    total
                  )} of ${total}`}</p>
                  <div className="inline-flex">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
                      disabled={pagination.current_page === 1}
                      className="px-3 py-1 border rounded-l disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 border">{`Page ${pagination.current_page} of ${pagination.last_page}`}</span>
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      className="px-3 py-1 border rounded-r disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home_Member;
