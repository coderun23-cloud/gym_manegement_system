import { useContext, useEffect, useState } from "react";
import NavBar from "./NavBar";
import { AppContext } from "../../context/AppContext";

function PaymentReceptionist() {
  const { token } = useContext(AppContext);

  const [allPayments, setAllPayments] = useState([]); // Raw data
  const [filteredPayments, setFilteredPayments] = useState([]); // After filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const pageSize = 10;

  // Fetch all data once
  useEffect(() => {
    const fetchAllPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setAllPayments(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPayments();
  }, [token]);

  // Apply filters (search and date) whenever the filter inputs or data change
  useEffect(() => {
    let filtered = [...allPayments];

    if (searchTerm) {
      filtered = filtered.filter((p) => {
        const name = p.user?.name?.toLowerCase() || "";
        const phone = p.user?.phone_number?.toString() || "";
        const search = searchTerm.toLowerCase();
        return name.includes(search) || phone.includes(search);
      });
    }

    if (startDate) {
      filtered = filtered.filter(
        (p) => new Date(p.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (p) => new Date(p.created_at) <= new Date(endDate)
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page on new filter
  }, [allPayments, searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-24">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Payment Records
        </h1>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Payments
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm p-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md"
                >
                  Search
                </button>
              </div>
            </form>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="rounded-md border-gray-300 shadow-sm p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  className="rounded-md border-gray-300 shadow-sm p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-4 py-2 bg-white border rounded-md text-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 inline-block"></div>
              <p className="mt-2 text-gray-600">Loading payments...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">Error: {error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "#",
                        "Name",
                        "Phone",
                        "Amount",
                        "Payment For",
                        "Date",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedPayments.length > 0 ? (
                      paginatedPayments.map((p, i) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {(currentPage - 1) * pageSize + i + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {p.user?.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            +251{p.user?.phone_number}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            ${p.amount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {p.payment_for}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * pageSize,
                        filteredPayments.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredPayments.length}
                    </span>{" "}
                    results
                  </p>
                  <div className="inline-flex space-x-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      &laquo;
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      &lsaquo;
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      &rsaquo;
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      &raquo;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentReceptionist;
