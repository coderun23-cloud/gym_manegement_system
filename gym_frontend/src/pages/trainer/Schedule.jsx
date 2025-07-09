import { useState, useEffect, useContext } from "react";
import Footer from "../../components/Footer";
import NavBar from "./Navbar";
import { format, parseISO } from "date-fns";
import { AppContext } from "../../context/AppContext";

function ScheduleTrainer() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const { user, token } = useContext(AppContext);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const fetchSchedules = async (page = 1) => {
    try {
      const trainerId = user?.id;
      const response = await fetch(`/api/${trainerId}/schedules?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch schedules.");
      }

      const data = await response.json();
      setSchedules(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || data.data?.length || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchSchedules(pagination.current_page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page, user, token]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPagination((prev) => ({ ...prev, current_page: newPage }));
    }
  };

  const filteredSchedules = dateFilter
    ? schedules.filter((schedule) => {
        const scheduleDate = parseISO(schedule.start_time);
        const scheduleDateStr = scheduleDate.toISOString().split("T")[0]; // UTC date in yyyy-MM-dd
        return scheduleDateStr === dateFilter;
      })
    : schedules;

  return (
    <div>
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-25 mb-80">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Training Schedule
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading schedules...</p>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  max={new Date().toISOString().split("T")[0]} // Sets max date to today
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border rounded shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(
                            parseISO(schedule.start_time),
                            "MMM dd, yyyy"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(parseISO(schedule.start_time), "hh:mm a")} -{" "}
                          {format(parseISO(schedule.end_time), "hh:mm a")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {schedule.member?.name || "Not assigned"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {schedule.member?.email || ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <p className="font-bold">
                            {schedule.title || "Personal Training"}
                          </p>
                          {schedule.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              schedule.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : schedule.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {schedule.status || "scheduled"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No schedules found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination.last_page > 1 && (
              <div className="flex justify-between items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{schedules.length}</span> of{" "}
                  <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </div>
                <nav className="inline-flex">
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 mr-2 text-sm border rounded disabled:opacity-50"
                  >
                    &larr; Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 ml-2 text-sm border rounded disabled:opacity-50"
                  >
                    Next &rarr;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ScheduleTrainer;
