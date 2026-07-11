import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";
import { useTeachers } from "../../context/TeacherContext";
import { useLabs } from "../../context/LabContext";
import { useAuth } from "../../context/AuthContext";

const Students = () => {
  const { students } = useStudents();

  const { labs } = useLabs();

  const { currentUser } = useAuth();

  const { getTeacherByUserId } = useTeachers();

  const teacher = getTeacherByUserId(currentUser?.id);

  const teacherLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id,
  );

  const teacherLabIds = teacherLabs.map((lab) => lab.id);

  const myStudents = students.filter((student) =>
    student.assignedLabs?.some((labId) => teacherLabIds.includes(labId)),
  );

  return (
    <DashboardLayout title="My Students">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            My Students
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-2">
            Active Directory • {myStudents.length} Students
          </p>
        </div>
      </div>

      {myStudents.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
            No active enrollments found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myStudents.map((student) => (
            <div
              key={student.id}
              className="relative bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-between shadow-sm transition-all duration-500 hover:shadow-xl hover:border-indigo-100 group overflow-hidden"
            >
              {/* Active Accent Border */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Student Identity */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-xl font-black text-gray-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {student.name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {student.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-100">
                      {student.usn}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {student.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="hidden md:flex items-center gap-8 text-right">
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-300">
                    Semester
                  </p>
                  <p className="text-sm font-black text-gray-900">
                    {student.semester}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-300">
                    Section
                  </p>
                  <p className="text-sm font-black text-gray-900">
                    {student.section}
                  </p>
                </div>
              </div>

              {/* Action */}
              <Link
                to={`/teacher/student/${student.id}`}
                className="bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl shadow-lg shadow-gray-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all active:scale-95"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Students;
