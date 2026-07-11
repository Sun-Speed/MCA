import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLabSession } from "../../context/LabSessionContext";

const Attendance = () => {
  const navigate = useNavigate();

  const { activeSession, markAttendance, endSession } = useLabSession();

  const finishSession = () => {
    console.log("Ending Session:", activeSession.id);

    endSession(activeSession.id);

    alert("Lab Session Completed");

    navigate("/teacher");
  };

  return (
    <DashboardLayout title="Attendance">
      {!activeSession ? (
        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 transition-all hover:border-indigo-200">
          {/* Minimalistic Icon Graphic */}
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>

          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            No Active Session
          </h2>
          <p className="mt-2 text-sm text-gray-400 font-medium max-w-xs text-center leading-relaxed">
            Your workspace is currently empty. Initiate a new lab session to get
            started.
          </p>

          {/* Call-to-Action Button */}
          <button
            onClick={() => navigate("/teacher")}
            className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Session Header Card */}
          <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl mb-8">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-8">
              {/* Top Row: Title & Action */}
              <div className="flex flex-wrap justify-between items-start gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        Live Session
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                      {activeSession.startTime}
                    </span>
                  </div>

                  <h1 className="text-5xl font-black tracking-tight">
                    {activeSession.lab.labName}
                  </h1>
                  <p className="text-indigo-300 font-bold tracking-widest uppercase text-xs mt-2 opacity-80">
                    {activeSession.department} • Semester{" "}
                    {activeSession.semester} • Section {activeSession.section}
                  </p>
                </div>

                <button
                  onClick={finishSession}
                  className="group relative bg-white text-gray-900 font-black px-8 py-4 rounded-3xl transition-all hover:scale-[1.02] hover:bg-rose-500 hover:text-white"
                >
                  <span className="relative z-10 uppercase tracking-widest text-xs">
                    End Lab Session
                  </span>
                </button>
              </div>

              {/* Metric Row: The "Quick Glance" Data */}
              <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                {[
                  { label: "Total", val: activeSession.students.length },
                  {
                    label: "Present",
                    val: activeSession.students.filter(
                      (s) => s.attendance === "PRESENT",
                    ).length,
                  },
                  {
                    label: "Absent",
                    val: activeSession.students.filter(
                      (s) => s.attendance === "ABSENT",
                    ).length,
                  },
                  {
                    label: "Late",
                    val: activeSession.students.filter(
                      (s) => s.attendance === "LATE",
                    ).length,
                  },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">
                      {stat.label}
                    </span>
                    <span className="text-2xl font-black">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student List Section */}
          <h2 className="text-2xl font-black text-gray-900 mb-6 px-1">
            Live Class List{" "}
            <span className="opacity-40">
              ({activeSession.students.length})
            </span>
          </h2>

          <div className="grid gap-4">
            {activeSession.students.map((student) => (
              <div
                key={student.studentId}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-indigo-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-500">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{student.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {student.rollNumber}
                    </p>
                  </div>
                </div>

                {/* Attendance Status Badge */}
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-[9px] font-black uppercase text-gray-400">
                      Entry/Exit
                    </p>
                    <p className="text-xs font-bold text-gray-600">
                      {student.entryTime || "--"} / {student.exitTime || "--"}
                    </p>
                  </div>

                  {/* Attendance Controls */}
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${student.attendance === "PRESENT" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-emerald-100"}`}
                      onClick={() =>
                        markAttendance(
                          activeSession.id,
                          student.studentId,
                          "PRESENT",
                        )
                      }
                    >
                      Present
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${student.attendance === "ABSENT" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-rose-100"}`}
                      onClick={() =>
                        markAttendance(
                          activeSession.id,
                          student.studentId,
                          "ABSENT",
                        )
                      }
                    >
                      Absent
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${student.attendance === "LATE" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-amber-100"}`}
                      onClick={() =>
                        markAttendance(
                          activeSession.id,
                          student.studentId,
                          "LATE",
                        )
                      }
                    >
                      Late
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Attendance;
