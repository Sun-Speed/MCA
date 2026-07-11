import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";
import { useLabSession } from "../../context/LabSessionContext";
import { useProjects } from "../../context/ProjectContext";
import StudentProjectCard from "../../components/student/StudentProjectCard";

import { useAssignments } from "../../context/AssignmentContext";
import AssignmentCard from "../../components/teacher/AssignmentCard";
import { useState } from "react";

const StudentDetails = () => {
  const { id } = useParams();

  const { getStudentById } = useStudents();

  const { sessions } = useLabSession();

  const { projects, updateProjectStudent } = useProjects();

  const { assignments, updateAssignment } = useAssignments();

  const student = getStudentById(id);

  const [performance, setPerformance] = useState(
    student.activities.labPerformance || {
      rating: "GOOD",

      teacherRemarks: "",
    },
  );

  if (!student) {
    return (
      <DashboardLayout title="Student Details">
        Student not found.
      </DashboardLayout>
    );
  }

  const attendance = [];

  sessions.forEach((session) => {
    session.students.forEach((s) => {
      if (String(s.studentId) === String(student.id)) {
        attendance.push(s);
      }
    });
  });

  const present = attendance.filter((a) => a.attendance === "PRESENT").length;

  const absent = attendance.filter((a) => a.attendance === "ABSENT").length;

  const late = attendance.filter((a) => a.attendance === "LATE").length;

  const percentage =
    attendance.length === 0
      ? 0
      : Math.round(((present + late) / attendance.length) * 100);

  const studentProjects = projects.filter((project) =>
    project.assignedStudents?.some(
      (assignedStudent) =>
        String(assignedStudent.studentId) === String(student.id),
    ),
  );

  const studentAssignments = assignments.filter((assignment) =>
    assignment.assignedStudents?.some(
      (assignedStudent) =>
        String(assignedStudent.studentId) === String(student.id),
    ),
  );

  return (
    <DashboardLayout title="Student Details">
      {/* Profile */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mb-8">
        {/* Header: Name and Avatar Placeholder */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-100">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {student.name}
            </h1>
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-1">
              Student Profile
            </p>
          </div>
        </div>

        {/* Data Grid: Cleaner, more organized layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
          {[
            { label: "USN", val: student.usn },
            { label: "Department", val: student.department },
            { label: "Semester", val: `Semester ${student.semester}` },
            { label: "Section", val: student.section },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <p className="text-sm font-bold text-gray-900">{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-8 tracking-tight">
          Attendance Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Present",
              val: present,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              label: "Late",
              val: late,
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "Absent",
              val: absent,
              color: "text-rose-600",
              bg: "bg-rose-50",
              border: "border-rose-100",
            },
            {
              label: "Attendance %",
              val: `${percentage}%`,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              border: "border-indigo-100",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} ${stat.border} border-2 rounded-2xl p-6 text-center transition-transform hover:scale-[1.02]`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">
                {stat.label}
              </p>
              <h3 className={`text-4xl font-black ${stat.color}`}>
                {stat.val}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* ================= Projects ================= */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 mt-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Assigned Projects
          </h2>
          <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest">
            {studentProjects.length} Projects
          </span>
        </div>

        {studentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 text-gray-400">
            <p className="font-bold uppercase tracking-widest text-xs">
              No projects assigned at this time.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {studentProjects.map((project) => (
              <StudentProjectCard
                key={project.id}
                project={project}
                student={student}
                updateProjectStudent={updateProjectStudent}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= Assignments ================= */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 mt-10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
           Assigned Assignments
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {studentAssignments.length} Active Tasks
            </span>
          </div>
        </div>

        {studentAssignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 text-gray-400">
            <p className="font-bold uppercase tracking-widest text-xs">
              No assignments currently active.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {studentAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                student={student}
                updateAssignment={updateAssignment}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 mt-10 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Overall Lab Performance
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Final evaluation summary
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Performance Rating Selection */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
              Performance Level
            </label>
            <select
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-black text-gray-900 appearance-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              value={performance.rating}
              onChange={(e) =>
                setPerformance({ ...performance, rating: e.target.value })
              }
            >
              <option value="POOR">Poor</option>
              <option value="AVERAGE">Average</option>
              <option value="GOOD">Good</option>
              <option value="VERY_GOOD">Very Good</option>
              <option value="EXCELLENT">Excellent</option>
            </select>
          </div>

          {/* Teacher Remarks */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
              Teacher Remarks
            </label>
            <textarea
              rows={4}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-black text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              value={performance.teacherRemarks}
              placeholder="Provide comprehensive feedback for the student..."
              onChange={(e) =>
                setPerformance({
                  ...performance,
                  teacherRemarks: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-8 flex justify-end">
          <button
            className="bg-gray-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-all shadow-lg shadow-gray-200 active:scale-95"
            onClick={() => {
              updateLabPerformance(student.id, performance);
              alert("Performance Saved");
            }}
          >
            Save Final Evaluation
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetails;
