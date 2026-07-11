import { useState } from "react";

import { useLabs } from "../../context/LabContext";
import Select from "../common/Select";
import { DEPARTMENTS, SEMESTERS, SECTIONS } from "../../utils/constants";


import { motion } from "framer-motion";
import { Building2, Hash, DoorOpen, LayoutGrid, Users, BookOpen } from "lucide-react";

const initialState = {
  labCode: "",
  labName: "",
  department: "",
  semester: "",
  section: "",
  building: "",
  floor: "",
  capacity: "",
};

const LabForm = () => {
  const { addLab } = useLabs();

  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    addLab({
      ...form,

      capacity: Number(form.capacity),

      systems: Number(form.systems),
    });

    setForm(initialState);
  };

  return (
  
    <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
  <div className="mb-8 border-b border-gray-100 pb-4">
    <h2 className="text-2xl font-bold text-gray-800">Add New Laboratory</h2>
    <p className="text-gray-500 text-sm">Enter the laboratory infrastructure details below.</p>
  </div>

  {/* 2-Column Grid Layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* Inputs wrapped in a helper group */}
    <div className="space-y-4">
      <Select label="Department" name="department" value={form.department} onChange={handleChange} options={DEPARTMENTS.map(d => ({ value: d, label: d }))} />
      
      <div className="relative group">
        <Hash className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500" size={18} />
        <input name="labCode" placeholder="Lab Code" value={form.labCode} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
      </div>

      <div className="relative group">
        <LayoutGrid className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500" size={18} />
        <input name="labName" placeholder="Lab Name" value={form.labName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
      </div>

      <Select label="Semester" name="semester" value={form.semester} onChange={handleChange} options={SEMESTERS.map(s => ({ value: s, label: s }))} />
    </div>

    <div className="space-y-4">
      <div className="relative group">
        <Users className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500" size={18} />
        <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
      </div>

      <div className="relative group">
        <Building2 className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500" size={18} />
        <input name="building" placeholder="Building" value={form.building} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
      </div>

      <div className="relative group">
        <DoorOpen className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500" size={18} />
        <input name="floor" placeholder="Floor" value={form.floor} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
      </div>

      <div className="relative group">
        <BookOpen className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500" size={18} />
        <input name="systems" placeholder="Number of Systems" value={form.systems} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
      </div>
    </div>
  </div>

  <motion.button 
    whileHover={{ scale: 1.01 }} 
    whileTap={{ scale: 0.99 }} 
    type="submit" 
    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
  >
    Save Laboratory Details
  </motion.button>
</form>
  );
};

export default LabForm;
