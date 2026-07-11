import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatSection from "../../components/common/StatSection";

import { LayoutGrid, BarChart3, PieChart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  Pie,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

import { useStudents } from "../../context/StudentContext";
import { useTeachers } from "../../context/TeacherContext";
import { useClerks } from "../../context/ClerkContext";
import { useLabs } from "../../context/LabContext";
import { useProjects } from "../../context/ProjectContext";
import { useAssignments } from "../../context/AssignmentContext";
import { useLabSession } from "../../context/LabSessionContext";

const Dashboard = () => {
  const { students } = useStudents();

  const { teachers } = useTeachers();

  const { clerks } = useClerks();

  const { labs } = useLabs();

  const { projects } = useProjects();

  const { assignments } = useAssignments();

  const { sessions } = useLabSession();

  const [viewMode, setViewMode] = useState("list");

  const totalAttendance = sessions.reduce(
    (total, s) => total + s.students.length,
    0,
  );

  const dataStatistics = [
    { name: "Students", count: students.length, color: "#2563eb" }, // blue-600
    { name: "Teachers", count: teachers.length, color: "#16a34a" }, // green-600
    { name: "Clerks", count: clerks.length, color: "#9333ea" }, // purple-600
    { name: "Labs", count: labs.length, color: "#f97316" }, // orange-500
  ];

  const dataAcademic = [
    { name: "Projects", count: projects.length, color: "#0891b2" }, // cyan-600
    { name: "Assignments", count: assignments.length, color: "#db2777" }, // pink-600
    { name: "Sessions", count: sessions.length, color: "#059669" }, // emerald-600
    { name: "Attendance", count: totalAttendance, color: "#ef4444" }, // red-500
  ];

  const departments = [...new Set(students.map((s) => s.department))];
  const data = departments.map((dept) => ({
    name: dept,
    value: students.filter((s) => s.department === dept).length,
  }));

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <DashboardLayout title="Reports Dashboard">
      {/* Header */}

      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

        <div className="relative z-10">

          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            HOD Analytics <span className="text-indigo-600">Dashboard</span>
          </h1>

          <p className="mt-4 text-gray-500 text-lg max-w-xl leading-relaxed">
            Monitor students, teachers, labs, and academic activities across the
            institution with real-time insights.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <StatSection title="Faculty Statistics" data={dataStatistics} />

      {/* Academic Statistics */}

      <StatSection title="Academic Statistics" data={dataAcademic} />

      {/* ================= Department Statistics ================= */}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Department Distribution
          </h2>
          <div className="bg-gray-50 p-1 rounded-lg border flex gap-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow text-indigo-600" : "text-gray-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`p-2 rounded-md ${viewMode === "chart" ? "bg-white shadow text-indigo-600" : "text-gray-400"}`}
            >
              <PieChartIcon size={18} />
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((dept, i) => (
              <div
                key={dept.name}
                className="flex justify-between items-center border border-gray-100 rounded-2xl p-5 hover:border-indigo-100 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-gray-800">{dept.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Department
                  </p>
                </div>
                <p className="text-2xl font-black text-indigo-600">
                  {dept.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ================= Teacher Workload ================= */}

      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Teacher Workload Distribution
          </h2>
          <div className="px-4 py-1 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-semibold text-gray-600">
            {teachers.length} Faculty Members
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachers.map((teacher, index) => {
            // Color palette matching your Lab section
            const colors = [
              "bg-blue-50 border-blue-200",
              "bg-emerald-50 border-emerald-200",
              "bg-violet-50 border-violet-200",
              "bg-amber-50 border-amber-200",
              "bg-rose-50 border-rose-200",
            ];
            const colorClass = colors[index % colors.length];

            const teacherLabs = labs.filter(
              (lab) => lab.assignedTeacherId === teacher.id,
            );
            const teacherStudents = students.filter((student) =>
              student.assignedLabs?.some((labId) =>
                teacherLabs.some((lab) => lab.id === labId),
              ),
            );

            return (
              <div
                key={teacher.id}
                className={`border-2 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-lg ${colorClass}`}
              >
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/70 flex items-center justify-center font-black text-2xl text-gray-800 shadow-sm">
                    {teacher.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {teacher.name}
                    </h3>
                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest">
                      {teacher.department}
                    </p>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-2xl p-5 border border-black/5">
                    <p className="text-[10px] uppercase font-black opacity-40 mb-1">
                      Assigned Labs
                    </p>
                    <h2 className="text-4xl font-black text-gray-900">
                      {teacherLabs.length}
                    </h2>
                  </div>
                  <div className="bg-white/50 rounded-2xl p-5 border border-black/5">
                    <p className="text-[10px] uppercase font-black opacity-40 mb-1">
                      Total Students
                    </p>
                    <h2 className="text-4xl font-black text-gray-900">
                      {teacherStudents.length}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Lab Utilization ================= */}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Lab Utilization Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labs.map((lab, index) => {
            // Define a palette of 5 soft pastel colors
            const colors = [
              "bg-blue-50 border-blue-100 text-blue-900",
              "bg-emerald-50 border-emerald-100 text-emerald-900",
              "bg-violet-50 border-violet-100 text-violet-900",
              "bg-amber-50 border-amber-100 text-amber-900",
              "bg-rose-50 border-rose-100 text-rose-900",
            ];

            const colorClass = colors[index % colors.length];
            const teacher = teachers.find(
              (t) => t.id === lab.assignedTeacherId,
            );
            const totalStudents = students.filter((s) =>
              s.assignedLabs?.includes(lab.id),
            ).length;
            const totalSessions = sessions.filter(
              (s) => s.lab?.id === lab.id,
            ).length;

            return (
              <div
                key={lab.id}
                className={`border-2 rounded-3xl p-6 transition-all duration-300 hover:shadow-lg ${colorClass}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black">{lab.labName}</h3>
                    <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">
                      {lab.department}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                    {lab.assignedSection}
                  </div>
                </div>

                {/* Stats Rows */}
                <div className="space-y-3">
                  {[
                    { label: "Teacher", value: teacher?.name || "Unassigned" },
                    { label: "Students", value: totalStudents },
                    { label: "Sessions", value: totalSessions },
                    { label: "Semester", value: lab.assignedSemester || "-" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-black/5 pb-2 last:border-0"
                    >
                      <span className="text-sm opacity-60 font-medium">
                        {stat.label}
                      </span>
                      <span className="font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= Assignment & Project Analytics ================= */}

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {[
          {
            title: "Assignment Analytics",
            accent: "border-l-indigo-500",
            bg: "bg-indigo-50/30",
            total: assignments.length,
            assigned: assignments.reduce(
              (t, a) => t + (a.assignedStudents?.length || 0),
              0,
            ),
            completed: assignments.reduce(
              (t, a) =>
                t +
                (a.assignedStudents?.filter((s) => s.status === "EVALUATED")
                  .length || 0),
              0,
            ),
            pending: assignments.reduce(
              (t, a) =>
                t +
                (a.assignedStudents?.filter((s) => s.status !== "EVALUATED")
                  .length || 0),
              0,
            ),
          },
          {
            title: "Project Analytics",
            accent: "border-l-violet-500",
            bg: "bg-violet-50/30",
            total: projects.length,
            assigned: projects.reduce(
              (t, p) => t + (p.assignedStudents?.length || 0),
              0,
            ),
            completed: projects.reduce(
              (t, p) =>
                t +
                (p.assignedStudents?.filter((s) => s.status === "COMPLETED")
                  .length || 0),
              0,
            ),
            pending: projects.reduce(
              (t, p) =>
                t +
                (p.assignedStudents?.filter((s) => s.status !== "COMPLETED")
                  .length || 0),
              0,
            ),
          },
        ].map((section, idx) => (
          <div
            key={idx}
            className={`bg-white border border-gray-100 rounded-3xl p-8 shadow-sm border-l-4 ${section.accent}`}
          >
            <h2 className="text-2xl font-black text-gray-900 mb-8">
              {section.title}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl ${section.bg}`}>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                  Total
                </p>
                <h3 className="text-3xl font-black text-gray-900">
                  {section.total}
                </h3>
              </div>
              <div className={`p-4 rounded-2xl ${section.bg}`}>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                  Assigned Students
                </p>
                <h3 className="text-3xl font-black text-gray-900">
                  {section.assigned}
                </h3>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-green-600/60 mb-1">
                  Completed
                </p>
                <h3 className="text-2xl font-black text-green-700">
                  {section.completed}
                </h3>
              </div>
              <div className="flex-1 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 mb-1">
                  Pending
                </p>
                <h3 className="text-2xl font-black text-rose-700">
                  {section.pending}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= Quick Insights ================= */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 mt-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-800 mb-8">
          📢 Quick Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "📝",
              label: "Pending Assignments",
              value: assignments.reduce(
                (t, a) =>
                  t +
                  (a.assignedStudents?.filter((s) => s.status !== "EVALUATED")
                    .length || 0),
                0,
              ),
              color: "bg-amber-50 text-amber-700 border-amber-100",
            },
            {
              icon: "💻",
              label: "Pending Projects",
              value: projects.reduce(
                (t, p) =>
                  t +
                  (p.assignedStudents?.filter((s) => s.status !== "COMPLETED")
                    .length || 0),
                0,
              ),
              color: "bg-rose-50 text-rose-700 border-rose-100",
            },
            {
              icon: "🎓",
              label: "Top Department",
              value:
                [...new Set(students.map((s) => s.department))].sort(
                  (a, b) =>
                    students.filter((s) => s.department === b).length -
                    students.filter((s) => s.department === a).length,
                )[0] || "--",
              color: "bg-blue-50 text-blue-700 border-blue-100",
            },
            {
              icon: "👨‍🏫",
              label: "Most Active Teacher",
              value:
                teachers.sort(
                  (a, b) =>
                    labs.filter((l) => l.assignedTeacherId === b.id).length -
                    labs.filter((l) => l.assignedTeacherId === a.id).length,
                )[0]?.name || "--",
              color: "bg-violet-50 text-violet-700 border-violet-100",
            },
            {
              icon: "🧪",
              label: "Most Active Lab",
              value:
                labs.sort(
                  (a, b) =>
                    sessions.filter((s) => s.lab.id === b.id).length -
                    sessions.filter((s) => s.lab.id === a.id).length,
                )[0]?.labName || "--",
              color: "bg-emerald-50 text-emerald-700 border-emerald-100",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`border-2 rounded-3xl p-6 flex items-start gap-4 transition-all duration-300 hover:shadow-md ${item.color}`}
            >
              <div className="text-3xl">{item.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">
                  {item.label}
                </p>
                <h3 className="text-xl font-black">{item.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
