import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useLabs } from "../../context/LabContext";
import { useTeachers } from "../../context/TeacherContext";
import { useStudents } from "../../context/StudentContext";
import { useLabSession } from "../../context/LabSessionContext";
import { useAuth } from "../../context/AuthContext";
import { useAssignments } from "../../context/AssignmentContext";
import { useProjects } from "../../context/ProjectContext";
import { FolderKanban, FileText, Clock3, Users, FlaskConical, ComputerIcon } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const { labs } = useLabs();

  const { students } = useStudents();

  // const { startSession } = useLabSession();
  const { startSession, sessions } = useLabSession();

  const { getTeacherByUserId } = useTeachers();

  const { assignments } = useAssignments();
  const { projects } = useProjects();

  const teacher = getTeacherByUserId(currentUser?.id);

  const assignedLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id,
  );

  const totalStudents = students.filter((student) =>
    student.assignedLabs?.some((labId) =>
      assignedLabs.some((lab) => lab.id === labId),
    ),
  ).length;

  const completedSessions = sessions.filter(
    (session) =>
      session.teacher.id === teacher.id && session.status === "COMPLETED",
  ).length;

  const pendingAssignments = assignments.reduce(
    (count, assignment) =>
      count +
      assignment.assignedStudents.filter(
        (student) => student.status !== "EVALUATED",
      ).length,
    0,
  );

  const myProjects = projects.filter(
    (project) => project.teacherId === teacher.id,
  );

  const pendingProjects = myProjects.reduce(
    (count, project) =>
      count +
      project.assignedStudents.filter(
        (student) => student.status !== "COMPLETED",
      ).length,
    0,
  );

  const handleStartSession = (lab) => {
    const sessionStudents = students.filter((student) =>
      student.assignedLabs?.includes(lab.id),
    );

    if (sessionStudents.length === 0) {
      alert("No students are assigned to this lab.");
      return;
    }

    startSession({
      teacher,
      lab,
      department: lab.department,
      semester: lab.assignedSemester,
      section: lab.assignedSection,
      students: sessionStudents,
    });

    navigate("/teacher/attendance");
  };

  return (
    <DashboardLayout title="Teacher Dashboard">
      {/* Header */}

      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-10 mb-8 shadow-sm">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-16 -mt-16 opacity-60" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest mb-4">
            <span>Faculty Portal</span>
          </div>

          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            Welcome back, {teacher?.name || "Teacher"} 👋
          </h1>

          <p className="mt-4 text-gray-500 text-lg max-w-xl leading-relaxed">
            You're looking at your institutional dashboard. Monitor your labs,
            attendance, ongoing projects, and assignment queues.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {[
          {
            label: "My Students",
            val: totalStudents,
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-100",
          },
          {
            label: "My Labs",
            val: assignedLabs.length,
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-100",
          },
          {
            label: "My Sessions",
            val: completedSessions,
            bg: "bg-violet-50",
            text: "text-violet-700",
            border: "border-violet-100",
          },
          {
            label: "Pending Assignments",
            val: pendingAssignments,
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-100",
          },
          {
            label: "Pending Projects",
            val: pendingProjects,
            bg: "bg-rose-50",
            text: "text-rose-700",
            border: "border-rose-100",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} ${stat.border} border-2 rounded-3xl p-6 transition-transform hover:scale-[1.02]`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
              {stat.label}
            </p>
            <h2 className={`text-4xl font-black ${stat.text}`}>{stat.val}</h2>
          </div>
        ))}
      </div>

      {/* Quick Actions */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-10 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Projects",
              path: "/teacher/projects",
              icon: <FolderKanban size={24} />,
              color:
                "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100",
            },
            {
              label: "Assignments",
              path: "/teacher/assignments",
              icon: <FileText size={24} />,
              color:
                "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100",
            },
            {
              label: "Session Log",
              path: "/teacher/sessions",
              icon: <Clock3 size={24} />,
              color:
                "bg-violet-50 text-violet-600 hover:bg-violet-100 border-violet-100",
            },
            {
              label: "Students",
              path: "/teacher/students",
              icon: <Users size={24} />,
              color:
                "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100",
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.02] ${action.color}`}
            >
              {action.icon}
              <span className="font-black uppercase tracking-widest text-[10px]">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* My Labs */}

      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
          My Assigned Labs
        </h2>

        {assignedLabs.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-bold uppercase tracking-widest">
            No Labs Assigned
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {assignedLabs.map((lab, index) => {
              // High-end, vibrant gradients for each card
              const gradients = [
                "from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100",
                "from-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-100",
                "from-violet-50 to-purple-50 border-violet-200 shadow-violet-100",
                "from-rose-50 to-pink-50 border-rose-200 shadow-rose-100",
                "from-amber-50 to-orange-50 border-amber-200 shadow-amber-100",
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <div
                  key={lab.id}
                  className={`group bg-gradient-to-br ${gradient} border-2 rounded-[2rem] p-8 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl`}
                >
                  {/* Lab Header with Icon */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-white/60 rounded-2xl shadow-sm border border-white">
                      <ComputerIcon size={24} className="text-gray-800" />
                    </div>
                    <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full shadow-sm uppercase tracking-widest text-gray-500">
                      {lab.department}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-6">
                    {lab.labName}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/40 p-3 rounded-2xl border border-white/50">
                      <p className="text-[9px] font-black uppercase opacity-50 mb-0.5">
                        Semester
                      </p>
                      <p className="font-bold text-gray-900">
                        {lab.assignedSemester}
                      </p>
                    </div>
                    <div className="bg-white/40 p-3 rounded-2xl border border-white/50">
                      <p className="text-[9px] font-black uppercase opacity-50 mb-0.5">
                        Section
                      </p>
                      <p className="font-bold text-gray-900">
                        {lab.assignedSection}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartSession(lab)}
                    className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-xs shadow-lg hover:bg-gray-800 transition-all active:scale-95"
                  >
                    Start Lab
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
