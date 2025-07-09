import { useState, useEffect, useContext } from "react";
import Footer from "../../components/Footer";
import NavBar from "./NavBar";
import { format, parseISO, isToday } from "date-fns";
import { AppContext } from "../../context/AppContext";

function Schedule_Member() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);
  const [attendanceSuccess, setAttendanceSuccess] = useState(null);
  const { user, token } = useContext(AppContext);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/schedule`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }

        const data = await response.json();
        setSchedule(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user.id, token]);

  const handleMarkAttendance = async () => {
    if (!schedule) return;

    setAttendanceLoading(true);
    setAttendanceError(null);
    setAttendanceSuccess(null);

    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          role: "member",
          status: attendanceStatus,
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

      setAttendanceSuccess("Attendance marked successfully!");
    } catch (err) {
      setAttendanceError(err.message);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const clearMessages = () => {
    setAttendanceError(null);
    setAttendanceSuccess(null);
  };

  useEffect(() => {
    if (attendanceError || attendanceSuccess) {
      const timer = setTimeout(clearMessages, 3000);
      return () => clearTimeout(timer);
    }
  }, [attendanceError, attendanceSuccess]);

  if (loading) {
    return (
      <div>
        <NavBar />
        <main className="container mx-auto px-4 py-8 mt-25 mb-80">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <main className="container mx-auto px-4 py-8 mt-25 mb-80">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <main className="container mx-auto px-4 py-8 mt-25 mb-80">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Training Schedule
        </h1>
        {schedule.length > 0 ? (
          schedule.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white shadow-md rounded-lg overflow-hidden mb-6"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Session Details
                    </h2>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {format(parseISO(schedule.start_time), "MMMM do, yyyy")}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {format(parseISO(schedule.start_time), "h:mm a")} -{" "}
                        {format(parseISO(schedule.end_time), "h:mm a")}
                      </p>
                      <p>
                        <span className="font-medium">Trainer:</span>{" "}
                        {schedule.trainer?.name || "Not assigned"}
                      </p>
                      <p>
                        <span className="font-medium">Session Type:</span>{" "}
                        {schedule.title}
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const sessionDate = parseISO(schedule.start_time);

                    if (isToday(sessionDate)) {
                      return (
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Mark Attendance
                          </h2>
                          {attendanceError && (
                            <div className="mb-3 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                              {attendanceError}
                            </div>
                          )}
                          {attendanceSuccess && (
                            <div className="mb-3 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
                              {attendanceSuccess}
                            </div>
                          )}
                          <div className="flex flex-col space-y-3">
                            <select
                              value={attendanceStatus}
                              onChange={(e) =>
                                setAttendanceStatus(e.target.value)
                              }
                              disabled={attendanceLoading}
                              className="p-2 border rounded-md"
                            >
                              <option value="present">Present</option>
                              <option value="late">Late</option>
                              <option value="absent">Absent</option>
                            </select>
                            <button
                              onClick={handleMarkAttendance}
                              disabled={attendanceLoading}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                              {attendanceLoading
                                ? "Processing..."
                                : "Mark Attendance"}
                            </button>
                          </div>
                        </div>
                      );
                    } else if (new Date(sessionDate) < new Date()) {
                      return (
                        <div className="text-red-600 font-medium mt-4">
                          You missed this session
                        </div>
                      );
                    }

                    return null; // Don't show anything for future sessions
                  })()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No scheduled training found</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Schedule_Member;
