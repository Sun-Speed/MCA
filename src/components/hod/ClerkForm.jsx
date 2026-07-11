import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useClerks } from "../../context/ClerkContext";

import { User, Mail, Hash, Building2, X } from "lucide-react";

const initialState = {
  name: "",
  email: "",
  employeeId: "",
  department: "",
};

const ClerkForm = ({
  editingClerk,
  onFinishEdit,
}) => {
  const {
    addClerk,
    updateClerk,
  } = useClerks();

  const {
    addUser,
    updateUser,
  } = useAuth();

  const [form, setForm] =
    useState(initialState);

  useEffect(() => {
    if (editingClerk) {
      setForm(editingClerk);
    } else {
      setForm(initialState);
    }
  }, [editingClerk]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.employeeId ||
      !form.department
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingClerk) {
      updateClerk(editingClerk.id, form);

      updateUser(editingClerk.userId, {
        name: form.name,
        email: form.email,
        department: form.department,
      });

      onFinishEdit();

      setForm(initialState);

      return;
    }

    const result = addUser({
      name: form.name,
      email: form.email,
      password: "123456",
      role: "clerk",
      department: form.department,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    addClerk({
      userId: result.user.id,

      employeeId: form.employeeId,

      name: form.name,

      email: form.email,

      department: form.department,
    });

    alert(
      "Clerk created.\nDefault Password : 123456"
    );

    setForm(initialState);
  };

  return (

    <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
  {/* Header with optional close button */}
  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
    <h2 className="text-xl font-bold text-gray-800">
      {editingClerk ? "Edit Clerk Details" : "Add New Clerk"}
    </h2>
    {editingClerk && (
      <button 
        type="button" 
        onClick={() => setEditingClerk(null)} 
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <X size={20} />
      </button>
    )}
  </div>

  {/* Form Fields */}
  {[
    { name: "name", placeholder: "Clerk Name", icon: User },
    { name: "email", placeholder: "Email Address", icon: Mail },
    { name: "employeeId", placeholder: "Employee ID", icon: Hash },
    { name: "department", placeholder: "Department", icon: Building2 },
  ].map((field) => {
    const Icon = field.icon;
    return (
      <div key={field.name} className="relative group">
        <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          <Icon size={18} />
        </div>
        <input
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white placeholder:text-gray-400"
          placeholder={field.placeholder}
          name={field.name}
          value={form[field.name]}
          onChange={handleChange}
          required
        />
      </div>
    );
  })}

  {/* Action Button */}
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    type="submit"
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all"
  >
    {editingClerk ? "Update Clerk Record" : "Save Clerk Profile"}
  </motion.button>
</form>
  );
};

export default ClerkForm;