import { useState } from "react";

import { useLabs } from "../../context/LabContext";
import { useTeachers } from "../../context/TeacherContext";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  BookOpen,
  Users,
  LayoutDashboard,
  Layers3,
} from "lucide-react";
import Select from "../common/Select"; // Assuming this is your path

const AssignLabForm = () => {
  const { labs, assignLabDetails } = useLabs();

  const { teachers } = useTeachers();

  const [form, setForm] = useState({
    labId: "",
    teacherId: "",
    subjectCode: "",
    semester: "",
    section: "",
  });

  const change = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    assignLabDetails(
      form.labId,

      form,
    );

    console.log(form);

    alert("Lab Assigned");
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6"
    >
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardCheck className="text-indigo-600" /> Assign Laboratory
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Map specific resources to faculty members.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Selection */}
        <Select
          label="Laboratory"
          name="labId"
          value={form.labId}
          onChange={change}
          options={labs.map((lab) => ({ value: lab.id, label: lab.labName }))}
        />

        {/* Teacher Selection */}
        <Select
          label="Assign Teacher"
          name="teacherId"
          value={form.teacherId}
          onChange={change}
          options={teachers.map((t) => ({ value: t.id, label: t.name }))}
        />

        <div className="relative group">
          <Layers3
            className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500"
            size={18}
          />
          <input
            name="semester"
            placeholder="Semester"
            onChange={change}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>

        <div className="relative group md:col-span-2">
          <LayoutDashboard
            className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500"
            size={18}
          />
          <input
            name="section"
            placeholder="Section (e.g., A, B, C)"
            onChange={change}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all"
      >
        Assign Lab Resources
      </motion.button>
    </form>
  );
};

export default AssignLabForm;
