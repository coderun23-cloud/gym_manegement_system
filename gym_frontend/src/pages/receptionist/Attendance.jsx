import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import NavBar from "./NavBar";

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
  const [userId, setUserId] = useState(null);

  // Fetch user ID and attendance records
  useEffect(() => {
    const fetchUserAndAttendance = async () => {
      try {
        setLoading((prev) => ({ ...prev, records: true }));
        const token = localStorage.getItem("token");

        // First get user info
        const userResponse = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user information");
        }

        const userData = await userResponse.json();
        setUserId(userData.id);

        // Then get attendance records
        const attendanceResponse = await fetch(
          `/api/attendance_detail?user_id=${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!attendanceResponse.ok) {
          throw new Error("Failed to fetch attendance records");
        }

        const attendanceData = await attendanceResponse.json();
        setAttendanceRecords(attendanceData);

        // Check if today's attendance is already marked
        const today = new Date().toISOString().split("T")[0];
        const todayRecord = attendanceData.find(
          (record) => record.date === today
        );
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

    fetchUserAndAttendance();
  }, []);

  // Handle status change
  const handleStatusChange = (e) => {
    setTodayStatus(e.target.value);
  };

  // Handle attendance submission
  const handleSubmit = async () => {
    if (!userId) return;

    setLoading((prev) => ({ ...prev, submitting: true }));
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          role: "trainer", // Hardcoded as trainer since this is the trainer's attendance
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
      const recordsResponse = await fetch(
        `/api/attendance_detail?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
    });
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
            Today's Attendance ({formatDate(new Date().toISOString())})
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <select
                value={todayStatus}
                onChange={handleStatusChange}
                disabled={todayMarked || loading.submitting}
                className="w-full px-3 py-2 border rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
            <button
              onClick={handleSubmit}
              disabled={todayMarked || loading.submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 w-full sm:w-auto"
            >
              {loading.submitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : todayMarked ? (
                "Already Marked"
              ) : (
                "Mark Attendance"
              )}
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
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((record) => (
                        <tr
                          key={`${record.date}-${record.status}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(record.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                record.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "absent"
                                  ? "bg-red-100 text-red-800"
                                  : record.status === "late"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {record.status
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </span>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
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
