import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";
import { useLabs } from "../../context/LabContext";
import { useLabSession } from "../../context/LabSessionContext";

const StudentDetails = () => {
  const { id } = useParams();

  const { getStudentById } = useStudents();

  const { labs } = useLabs();

  const { sessions } = useLabSession();

  const student = getStudentById(Number(id));

  if (!student) {
    return (
      <DashboardLayout title="Student Details">
        Student Not Found
      </DashboardLayout>
    );
  }

  const assignedLabs = labs.filter((lab) =>
    student.assignedLabs?.includes(lab.id),
  );

  const studentSessions = sessions.filter((session) =>
    session.students.some((item) => item.studentId === student.id),
  );

  let present = 0;
  let absent = 0;
  let late = 0;

  studentSessions.forEach((session) => {
    const record = session.students.find(
      (item) => item.studentId === student.id,
    );

    if (!record) return;

    if (record.attendance === "PRESENT") present++;

    if (record.attendance === "ABSENT") absent++;

    if (record.attendance === "LATE") late++;
  });

  const percentage =
    studentSessions.length === 0
      ? 0
      : (((present + late) / studentSessions.length) * 100).toFixed(1);

  return (
    <DashboardLayout title="Student Details">
      <div className="max-w-4xl">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Student Profile
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
            Personal Identification & Academic Overview
          </p>
        </div>

        {/* Profile Identity Card */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start">
          {/* Large Avatar Placeholder */}
          <div className="w-32 h-32 rounded-3xl bg-indigo-50 flex items-center justify-center shrink-0">
            <span className="text-5xl font-black text-indigo-600">
              {student.name.charAt(0)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 flex-1">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Full Name
              </p>
              <h2 className="text-xl font-black text-gray-900">
                {student.name}
              </h2>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                USN
              </p>
              <span className="text-indigo-600 font-black tracking-tight">
                {student.usn}
              </span>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Department
              </p>
              <p className="font-bold text-gray-900">{student.department}</p>
            </div>

            <div className="flex gap-12">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Semester
                </p>
                <p className="font-bold text-gray-900">{student.semester}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Section
                </p>
                <p className="font-bold text-gray-900">{student.section}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Labs */}

      <div className="mt-8">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
          Active Lab Enrollments
        </h2>

        {assignedLabs.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              No lab enrollments found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedLabs.map((lab) => (
              <div
                key={lab.id}
                className="flex items-center gap-4 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:border-indigo-100 transition-all"
              >
                {/* Lab Icon Indicator */}
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                  {lab.labName.charAt(0)}
                </div>

                {/* Lab Info */}
                <div>
                  <p className="text-sm font-black text-gray-900">
                    {lab.labName}
                  </p>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
                    Active Session
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mt-8">
        <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8">
          Attendance Analytics
        </h2>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
              Present
            </p>
            <h3 className="text-2xl font-black text-emerald-900">{present}</h3>
          </div>
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">
              Late
            </p>
            <h3 className="text-2xl font-black text-amber-900">{late}</h3>
          </div>
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mb-1">
              Absent
            </p>
            <h3 className="text-2xl font-black text-rose-900">{absent}</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
              Total
            </p>
            <h3 className="text-2xl font-black text-gray-900">
              {studentSessions.length}
            </h3>
          </div>
        </div>

        {/* Percentage Bar */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
              Attendance Rate
            </p>
            <h3 className="text-lg font-black text-gray-900">{percentage}%</h3>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full max-w-[200px] h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Session History */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Session History
          </h2>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
            {studentSessions.length} Total Sessions
          </span>
        </div>

        {studentSessions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-bold uppercase text-xs tracking-widest">
            No session records found.
          </div>
        ) : (
          <div className="space-y-6">
            {studentSessions
              .slice()
              .reverse()
              .map((session) => {
                const record = session.students.find(
                  (item) => item.studentId === student.id,
                );
                const isPresent = record.attendance === "Present";

                return (
                  <div key={session.id} className="flex gap-6 group">
                    {/* Timeline Connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${isPresent ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                      <div className="w-px h-full bg-gray-100 mt-2 group-last:hidden" />
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-black text-gray-900">
                            {session.lab.labName}
                          </h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span
  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
    record.attendance === "PRESENT"
      ? "bg-emerald-50 text-emerald-600"
      : record.attendance === "LATE"
      ? "bg-amber-50 text-amber-600"
      : "bg-rose-50 text-rose-600"
  }`}
>
  {record.attendance}
</span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-xl">
                        <div>
                          <p className="text-[9px] font-black uppercase text-gray-400">
                            Entry
                          </p>
                          <p className="text-xs font-bold text-gray-700">
                            {record.entryTime || "--"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-gray-400">
                            Exit
                          </p>
                          <p className="text-xs font-bold text-gray-700">
                            {record.exitTime || "--"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-gray-400">
                            Remarks
                          </p>
                          <p className="text-xs font-bold text-gray-700 truncate">
                            {record.remarks || "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;
