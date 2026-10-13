import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLabSession } from "../../context/LabSessionContext";
import { useState } from "react";

const SessionDetails = () => {
  const { id } = useParams();

  const [editingStudent, setEditingStudent] = useState(null);

  const { getSession, updateStudentDetails } = useLabSession();

  const session = getSession(id);

  console.log("com", session);
  

  if (!session) {
    return <DashboardLayout title="Session">Session Not Found</DashboardLayout>;
  }

  return (
    <DashboardLayout title="Session Details">
      {/* Header Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-10 mb-8 shadow-sm">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
          {session.lab.labName}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Date", val: new Date(session.date).toLocaleDateString() },
            { label: "Teacher", val: session.teacher.name },
            { label: "Department", val: session.department },
            {
              label: "Semester/Sec",
              val: `${session.semester} / ${session.section}`,
            },
            { label: "Start Time", val: session.startTime },
            { label: "End Time", val: session.endTime },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                {item.label}
              </p>
              <p className="font-bold text-gray-900">{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Students Section */}
      <h2 className="text-2xl font-black text-gray-900 mb-6 px-1">
        Student Attendance Records
      </h2>

      <div className="space-y-4">
        {session.students.map((student) => (
          <div
            key={student.studentId}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-indigo-100 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Identity */}
              <div className="min-w-[200px]">
                <h3 className="font-black text-gray-900">{student.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {student.usn}
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
                    Status
                  </p>
                  <span
                    className={`font-black text-xs px-3 py-1 rounded-full ${
                      student.attendance === "PRESENT"
                        ? "bg-emerald-50 text-emerald-700"
                        : student.attendance === "LATE"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {student.attendance}
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
                    Entry / Exit
                  </p>
                  <p className="text-xs font-bold">
                    {student.entryTime || "--"} / {student.exitTime || "--"}
                  </p>
                </div>

                {/* Editable Fields */}
                <div className="col-span-2 md:col-span-2">
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-1">
                    Exit & Remarks
                  </p>

                  {editingStudent === student.studentId ? (
                    <div className="flex gap-2">
                      <input
                        type="time"
                        className="border border-gray-200 rounded-xl px-3 py-1 text-xs"
                        onChange={(e) =>
                          updateStudentDetails(session.id, student.studentId, {
                            exitTime: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border border-gray-200 rounded-xl px-3 py-1 text-xs flex-1"
                        placeholder="Remarks..."
                        onChange={(e) =>
                          updateStudentDetails(session.id, student.studentId, {
                            remarks: e.target.value,
                          })
                        }
                      />
                      <button
                        className="bg-gray-900 text-white px-4 rounded-xl text-[10px] font-black"
                        onClick={() => setEditingStudent(null)}
                      >
                        SAVE
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-600 truncate">
                        {student.remarks || "--"}
                      </p>
                      <button
                        className="text-[9px] font-black uppercase text-indigo-600 hover:underline"
                        onClick={() => setEditingStudent(student.studentId)}
                      >
                        Edit Record
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SessionDetails;
