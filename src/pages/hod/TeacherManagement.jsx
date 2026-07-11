import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Users } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

import TeacherForm from "../../components/teacher/TeacherForm";
import TeacherTable from "../../components/teacher/TeacherTable";
import { useTeachers } from "../../context/TeacherContext";

const menu = [
  {
    label: "Dashboard",
    path: "/hod",
  },
  {
    label: "Teachers",
    path: "/hod/teachers",
  },
];

const TeacherManagement = () => {
  const { teachers } = useTeachers();
  const [editingTeacher, setEditingTeacher] = useState(null);

  return (
    <DashboardLayout title="Teacher Management" menu={menu}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Side: Title & Description */}
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Teachers Management
            </h1>
            <p className="mt-2 text-gray-500 text-lg">
              Manage your faculty members, track department profiles, and update
              credentials.
            </p>
          </div>

          {/* Right Side: Quick Stats Badge */}
          <div className="flex items-center gap-3 bg-indigo-50/50 border border-indigo-100 text-indigo-700 px-6 py-4 rounded-2xl">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Total Staff
              </p>
              <span className="text-2xl font-black">
                {teachers?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section - Sticky on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <TeacherForm
              editingTeacher={editingTeacher}
              onFinishEdit={() => setEditingTeacher(null)}
            />
          </motion.div>

          {/* Table Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold">Faculty Directory</h2>
              </div>
              <div className="p-6">
                <TeacherTable onEdit={setEditingTeacher} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TeacherManagement;
