import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  FlaskConical,
  Activity,
  Briefcase,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useTeachers } from "../../context/TeacherContext";
import { useStudents } from "../../context/StudentContext";
import { useLabs } from "../../context/LabContext";
import { useProjects } from "../../context/ProjectContext";
import { useAssignments } from "../../context/AssignmentContext";
import { useLabSession } from "../../context/LabSessionContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { teachers } = useTeachers();
  const { students } = useStudents();
  const { labs } = useLabs();
  const { projects } = useProjects();
  const { assignments } = useAssignments();
  const { sessions } = useLabSession();

  const activeLabs = labs.filter((lab) => lab.status === "ACTIVE").length;

  const activeSessions = sessions.filter(
    (session) => session.status === "ACTIVE",
  ).length;

  const completedSessions = sessions.filter(
    (session) => session.status === "COMPLETED",
  ).length;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <DashboardLayout title="HOD Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-white border border-indigo-100 rounded-3xl p-10 mb-8 shadow-sm"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-80" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-50 rounded-full blur-[100px] -ml-20 -mb-20 opacity-80" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                Welcome back, HOD 👋
              </h1>
              <p className="mt-3 text-gray-500 text-lg max-w-xl leading-relaxed">
                You're looking at your institutional overview. Monitor faculty,
                labs, and student performance in real-time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
        >
          {[
            {
              label: "Total Teachers",
              value: teachers.length,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              icon: <Users size={24} />,
            },
            {
              label: "Total Students",
              value: students.length,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              icon: <GraduationCap size={24} />,
            },
            {
              label: "Total Labs",
              value: labs.length,
              color: "text-violet-600",
              bg: "bg-violet-50",
              icon: <FlaskConical size={24} />,
            },
            {
              label: "Active Labs",
              value: activeLabs,
              color: "text-rose-600",
              bg: "bg-rose-50",
              icon: <Activity size={24} />,
            },
          ].map((stat, i) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={i}
              className={`${stat.bg} p-6 rounded-3xl border border-black/5 shadow-sm transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {stat.label}
                </p>
                <div className={`p-2 rounded-xl bg-white/50 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <h2
                className={`text-4xl font-black tracking-tight ${stat.color}`}
              >
                {stat.value}
              </h2>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-10"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Teachers",
                action: () => navigate("/hod/teachers"),
                color: "bg-blue-600",
              },
              {
                label: "Clerks",
                action: () => navigate("/hod/clerks"),
                color: "bg-green-600",
              },
              {
                label: "Labs",
                action: () => navigate("/hod/labs"),
                color: "bg-purple-600",
              },
              {
                label: "Reports",
                action: () => navigate("/hod/reports"),
                color: "bg-orange-500",
              },
            ].map((btn, i) => (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={btn.action}
                key={i}
                className={`${btn.color} text-white rounded-xl py-4 font-semibold shadow-md`}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Department Overview (Refined List) */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm"
        >
          <h2 className="text-xl font-black text-gray-900 mb-8 tracking-tight">
            Department Snapshot
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                label: "Teachers",
                val: teachers.length,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                label: "Students",
                val: students.length,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Labs",
                val: labs.length,
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
              {
                label: "Projects",
                val: projects.length,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Assignments",
                val: assignments.length,
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
              {
                label: "Sessions",
                val: activeSessions,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.bg} p-5 rounded-2xl border border-black/5 transition-transform hover:scale-[1.02]`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                  {item.label}
                </p>
                <h3 className={`text-3xl font-black ${item.color}`}>
                  {item.val}
                </h3>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
