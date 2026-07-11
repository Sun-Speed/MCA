import { useState, useEffect } from "react";
import { useTeachers } from "../../context/TeacherContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Hash, Building2, X } from "lucide-react";

const initialState = {
  name: "",
  email: "",
  employeeId: "",
  department: "",
};

const TeacherForm = ({ editingTeacher, onFinishEdit }) => {
  const { addTeacher, updateTeacher } = useTeachers();

  const { addUser, updateUser } = useAuth();

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingTeacher) {
      setForm(editingTeacher);
    } else {
      setForm(initialState);
    }
  }, [editingTeacher]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.employeeId || !form.department) {
      alert("Please fill all fields");
      return;
    }

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, form);

      updateUser(editingTeacher.userId, {
        name: form.name,
        email: form.email,
        department: form.department,
      });

      onFinishEdit();

      setForm(initialState);

      return;
    }

    // ---------- Create Login Account ----------

    const result = addUser({
      name: form.name,
      email: form.email,
      password: "123456",
      role: "teacher",
      department: form.department,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    // ---------- Create Teacher Profile ----------

    addTeacher({
      userId: result.user.id,
      employeeId: form.employeeId,
      name: form.name,
      email: form.email,
      department: form.department,
      assignedLabs: [],
    });

    alert("Teacher created.\nDefault Password : 123456");

    setForm(initialState);
  };

  return (
    // <form onSubmit={submit} className="border p-5 rounded space-y-3">
    //   <h2 className="text-xl font-bold">
    //     {editingTeacher ? "Edit Teacher" : "Add Teacher"}
    //   </h2>

    //   <input
    //     className="border p-2 w-full"
    //     placeholder="Teacher Name"
    //     name="name"
    //     value={form.name}
    //     onChange={handleChange}
    //   />

    //   <input
    //     className="border p-2 w-full"
    //     placeholder="Email"
    //     name="email"
    //     value={form.email}
    //     onChange={handleChange}
    //   />

    //   <input
    //     className="border p-2 w-full"
    //     placeholder="Employee ID"
    //     name="employeeId"
    //     value={form.employeeId}
    //     onChange={handleChange}
    //   />

    //   <input
    //     className="border p-2 w-full"
    //     placeholder="Department"
    //     name="department"
    //     value={form.department}
    //     onChange={handleChange}
    //   />

    //   <button className="border px-4 py-2" type="submit">
    //     Save Teacher
    //   </button>
    // </form>



//     <form onSubmit={submit} className="space-y-5">
//   <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
//     {editingTeacher ? "Edit Teacher Details" : "Add New Teacher"}
//   </h2>

//   {/* Input Group Helper */}
//   {[
//     { name: "name", placeholder: "Teacher Name", type: "text" },
//     { name: "email", placeholder: "Email Address", type: "email" },
//     { name: "employeeId", placeholder: "Employee ID", type: "text" },
//     { name: "department", placeholder: "Department", type: "text" },
//   ].map((field) => (
//     <div key={field.name} className="relative">
//       <input
//         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-gray-50 focus:bg-white placeholder:text-gray-400"
//         placeholder={field.placeholder}
//         type={field.type}
//         name={field.name}
//         value={form[field.name]}
//         onChange={handleChange}
//         required
//       />
//     </div>
//   ))}

//   <motion.button
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//     type="submit"
//     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-indigo-200 transition-colors"
//   >
//     {editingTeacher ? "Update Teacher" : "Save Teacher"}
//   </motion.button>
// </form>

<form onSubmit={submit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
    <h2 className="text-xl font-bold text-gray-800">
      {editingTeacher ? "Edit Teacher Details" : "Add New Teacher"}
    </h2>
    {editingTeacher && (
      <button 
        type="button" 
        onClick={onFinishEdit}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <X size={20} />
      </button>
    )}
  </div>

  {[
    { name: "name", placeholder: "Teacher Name", icon: User },
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

  <div className="pt-2">
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all"
    >
      {editingTeacher ? "Update Record" : "Save Teacher"}
    </motion.button>
  </div>
</form>
  );
};

export default TeacherForm;
