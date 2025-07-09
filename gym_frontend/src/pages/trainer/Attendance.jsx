import { useState, useEffect } from "react";
import NavBar from "./Navbar";
import Footer from "../../components/Footer";

function Attendance_Trainer() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState({
    records: true,
    submitting: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [todayStatus, setTodayStatus] = useState("present");
  const [todayMarked, setTodayMarked] = useState(false);

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading((prev) => ({ ...prev, records: true }));
        const token = localStorage.getItem("token");

        const response = await fetch("/api/attendance_detail", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance records");
        }

        const data = await response.json();
        setAttendanceRecords(data);

        // Check if today's attendance is already marked
        const today = new Date().toISOString().split("T")[0];
        const todayRecord = data.find((record) => record.date === today);
        if (todayRecord) {
          setTodayMarked(true);
          setTodayStatus(todayRecord.status);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, records: false }));
      }
    };

    fetchAttendance();
  }, []);

  // Handle status change
  const handleStatusChange = (e) => {
    setTodayStatus(e.target.value);
  };

  // Handle attendance submission
  const handleSubmit = async () => {
    setLoading((prev) => ({ ...prev, submitting: true }));
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const response = await fetch("/api/attendance/mark-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: todayStatus,
          date: today,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            data.message || "Attendance already marked for today"
          );
        }
        throw new Error(data.message || "Failed to mark attendance");
      }

      setSuccess("Attendance marked successfully!");
      setTodayMarked(true);

      // Refresh attendance records
      const recordsResponse = await fetch("/api/attendance_detail", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const recordsData = await recordsResponse.json();
      setAttendanceRecords(recordsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-25 mb-80">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Attendance</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Today's Attendance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Today's Attendance ({new Date().toLocaleDateString()})
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <select
                value={todayStatus}
                onChange={handleStatusChange}
                disabled={todayMarked || loading.submitting}
                className="w-full px-3 py-2 border rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
            <button
              onClick={handleSubmit}
              disabled={todayMarked || loading.submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {todayMarked ? "Already Marked" : "Mark Attendance"}
            </button>
          </div>
          {todayMarked && (
            <p className="mt-2 text-sm text-green-600">
              You've already marked your attendance as {todayStatus} for today.
            </p>
          )}
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-800 p-4 border-b">
            Attendance History
          </h2>

          {loading.records ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2">Loading attendance records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record) => (
                      <tr key={`${record.date}-${record.status}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              record.status === "present"
                                ? "bg-green-100 text-green-800"
                                : record.status === "absent"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Attendance_Trainer;
