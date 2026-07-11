import { useEffect } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";

import useForm from "../../hooks/useForm";

import { useStudents } from "../../context/StudentContext";
// import { useSubjects } from "../../context/SubjectContext";

import { DEPARTMENTS, SECTIONS, SEMESTERS } from "../../utils/constants";

const initialState = {
  usn: "",
  name: "",
  department: "",
  semester: "",
  section: "",
  assignedLabs: [],
};

const StudentForm = ({ editingStudent, onFinishEdit }) => {
  const { addStudent, updateStudent } = useStudents();

  // const { subjects } = useSubjects();

  const { form, setForm, handleChange, resetForm } = useForm(initialState);

  useEffect(() => {
    if (editingStudent) {
      setForm(editingStudent);
    }
  }, [editingStudent]);

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.usn ||
      !form.name ||
      !form.department ||
      !form.semester ||
      !form.section
    ) {
      alert("Please fill in all fields before registering.");
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, form);

      onFinishEdit();

      resetForm();

      return;
    }

    addStudent(form);

    resetForm();
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm max-w-xl mx-auto"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {editingStudent ? "Update Record" : "Register Student"}
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          Enter student details below
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Input
          label="University Seat Number (USN)"
          name="usn"
          value={form.usn}
          onChange={handleChange}
        />

        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <Select
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
        />

        <Select
          label="Semester"
          name="semester"
          value={form.semester}
          onChange={handleChange}
          options={SEMESTERS.map((s) => ({ value: s, label: s }))}
        />

        <Select
          label="Section"
          name="section"
          value={form.section}
          onChange={handleChange}
          options={SECTIONS.map((s) => ({ value: s, label: s }))}
        />
      </div>

      {/* <div className="flex flex-col gap-6">... Your Inputs ...</div> */}

      <div className="mt-10">
        <button
          type="submit"
          className="w-full relative overflow-hidden group bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all hover:bg-indigo-600 active:scale-95"
        >
          {/* Shimmer Effect Decoration */}
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

          {editingStudent ? "Update Student Record" : "Register Student"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;