import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLabSession } from "../../context/LabSessionContext";
import { Clock3 } from "lucide-react";

const Sessions = () => {

    const navigate = useNavigate();
    
  const { sessions } = useLabSession();

  return (

<DashboardLayout title="Session History">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
    <div>
      <h2 className="text-4xl font-black text-gray-900 tracking-tight">Session History</h2>
      <p className="text-gray-500 mt-2">A complete audit trail of your previous lab engagements.</p>
    </div>
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2 rounded-2xl">
      <div className="w-2 h-2 rounded-full bg-indigo-500" />
      <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
        {sessions.length} Total Records
      </span>
    </div>
  </div>

  {sessions.length === 0 ? (
    <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center">
      <p className="text-gray-400 font-bold uppercase tracking-widest">No Historical Sessions Found</p>
    </div>
  ) : (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {sessions.slice().reverse().map((session) => {
        const present = session.students.filter(s => s.attendance === "PRESENT").length;
        const absent = session.students.filter(s => s.attendance === "ABSENT").length;
        const late = session.students.filter(s => s.attendance === "LATE").length;

        return (
          <div
            key={session.id}
            className="bg-white border border-gray-100 rounded-3xl p-7 transition-all duration-300 hover:border-gray-200 hover:shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">{session.lab.labName} Lab</h3> 
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {new Date(session.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                {session.startTime}
              </div>
            </div>

            {/* Stats Bar - Simplified */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 border-r border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Present</p>
                <p className="text-xl font-black text-emerald-600">{present}</p>
              </div>
              <div className="flex-1 border-r border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Absent</p>
                <p className="text-xl font-black text-rose-600">{absent}</p>
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Late</p>
                <p className="text-xl font-black text-amber-600">{late}</p>
              </div>
            </div>

            {/* View Details */}
            <button
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all"
              onClick={() => navigate(`/teacher/session/${session.id}`)}
            >
              View Report
            </button>
          </div>
        );
      })}
    </div>
  )}
</DashboardLayout>


  );
};

export default Sessions;