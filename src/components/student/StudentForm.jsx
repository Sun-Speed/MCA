// import { useEffect } from "react";

// import Input from "../common/Input";
// import Button from "../common/Button";
// import Select from "../common/Select";

// import useForm from "../../hooks/useForm";

// import { useStudents } from "../../context/StudentContext";
// // import { useSubjects } from "../../context/SubjectContext";

// import { DEPARTMENTS, SECTIONS, SEMESTERS } from "../../utils/constants";

// const initialState = {
//   usn: "",
//   name: "",
//   department: "",
//   semester: "",
//   section: "",
//   assignedLabs: [],
// };

// const StudentForm = ({ editingStudent, onFinishEdit }) => {
//   const { addStudent, updateStudent } = useStudents();

//   // const { subjects } = useSubjects();

//   const { form, setForm, handleChange, resetForm } = useForm(initialState);

//   useEffect(() => {
//     if (editingStudent) {
//       setForm(editingStudent);
//     }
//   }, [editingStudent]);

//   const submit = (e) => {
//     e.preventDefault();

//     if (
//       !form.usn ||
//       !form.name ||
//       !form.department ||
//       !form.semester ||
//       !form.section
//     ) {
//       alert("Please fill in all fields before registering.");
//       return;
//     }

//     if (editingStudent) {
//       updateStudent(editingStudent.id, form);

//       onFinishEdit();

//       resetForm();

//       return;
//     }

//     addStudent(form);

//     resetForm();
//   };

//   return (
//     <form
//       onSubmit={submit}
//       className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm max-w-xl mx-auto"
//     >
//       <div className="mb-10">
//         <h2 className="text-2xl font-black text-gray-900 tracking-tight">
//           {editingStudent ? "Update Record" : "Register Student"}
//         </h2>
//         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
//           Enter student details below
//         </p>
//       </div>

//       <div className="flex flex-col gap-6">
//         <Input
//           label="University Seat Number (USN)"
//           name="usn"
//           value={form.usn}
//           onChange={handleChange}
//         />

//         <Input
//           label="Full Name"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//         />

//         <Select
//           label="Department"
//           name="department"
//           value={form.department}
//           onChange={handleChange}
//           options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
//         />

//         <Select
//           label="Semester"
//           name="semester"
//           value={form.semester}
//           onChange={handleChange}
//           options={SEMESTERS.map((s) => ({ value: s, label: s }))}
//         />

//         <Select
//           label="Section"
//           name="section"
//           value={form.section}
//           onChange={handleChange}
//           options={SECTIONS.map((s) => ({ value: s, label: s }))}
//         />
//       </div>

//       {/* <div className="flex flex-col gap-6">... Your Inputs ...</div> */}

//       <div className="mt-10">
//         <button
//           type="submit"
//           className="w-full relative overflow-hidden group bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all hover:bg-indigo-600 active:scale-95"
//         >
//           {/* Shimmer Effect Decoration */}
//           <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

//           {editingStudent ? "Update Student Record" : "Register Student"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default StudentForm;

import { useEffect, useRef, useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";

import useForm from "../../hooks/useForm";
import { useStudents } from "../../context/StudentContext";

import { DEPARTMENTS, SECTIONS, SEMESTERS } from "../../utils/constants";

const initialState = {
  usn: "",
  name: "",
  department: "",
  semester: "",
  section: "",
  assignedLabs: [],
  photo: "",
};

const StudentForm = ({ editingStudent, onFinishEdit }) => {
  const { addStudent, updateStudent } = useStudents();

  const { form, setForm, handleChange, resetForm } = useForm(initialState);

  const fileInputRef = useRef(null);
  const [photoError, setPhotoError] = useState("");

  // Load existing student data when editing.
  useEffect(() => {
    if (editingStudent) {
      setForm({
        ...initialState,
        ...editingStudent,
        assignedLabs: editingStudent.assignedLabs || [],
        photo: editingStudent.photo || "",
      });
    } else {
      setForm({ ...initialState });
    }

    setPhotoError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [editingStudent, setForm]);

  // Open the file picker.
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Read and preview the selected image.
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Photo size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((previous) => ({
          ...previous,
          photo: reader.result,
        }));
      }
    };

    reader.onerror = () => {
      setPhotoError("Could not read this photo. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  // Remove the selected image.
  const removePhoto = () => {
    setForm((previous) => ({
      ...previous,
      photo: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setPhotoError("");
  };

  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.usn?.trim() ||
      !form.name?.trim() ||
      !form.department ||
      !form.semester ||
      !form.section
    ) {
      alert("Please fill in all fields before registering.");
      return;
    }

    if (!form.photo) {
      setPhotoError("Please upload the student's photo.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, form);
        onFinishEdit();
      } else {
        await addStudent(form);
      }

      resetForm();
      setPhotoError("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert(
        editingStudent
          ? "Student updated successfully."
          : "Student registered successfully.",
      );
    } catch (error) {
      alert(error.message || "Unable to save the student.");
    } finally {
      setSubmitting(false);
    }
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
        {/* STUDENT PHOTO */}
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold text-gray-700 mb-3 self-start">
            Student Photo
          </label>

          <button
            type="button"
            onClick={handlePhotoClick}
            className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
            aria-label="Upload or change student photo"
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt="Student preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-center text-sm text-gray-500 px-3">
                <span className="block text-4xl mb-2">📷</span>
                Click to upload photo
              </span>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          <p className="text-xs text-gray-400 mt-2">
            Image files only · Maximum 5 MB
          </p>

          {form.photo && (
            <div className="flex gap-4 mt-3">
              <button
                type="button"
                onClick={handlePhotoClick}
                className="text-sm text-indigo-600 hover:underline"
              >
                Change photo
              </button>

              <button
                type="button"
                onClick={removePhoto}
                className="text-sm text-red-600 hover:underline"
              >
                Remove photo
              </button>
            </div>
          )}

          {photoError && (
            <p role="alert" className="text-sm text-red-600 mt-3 text-center">
              {photoError}
            </p>
          )}
        </div>

        {/* STUDENT DETAILS */}
        <Input
          label="University Seat Number (USN)"
          name="usn"
          value={form.usn || ""}
          onChange={handleChange}
        />

        <Input
          label="Full Name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
        />

        <Select
          label="Department"
          name="department"
          value={form.department || ""}
          onChange={handleChange}
          options={DEPARTMENTS.map((d) => ({
            value: d,
            label: d,
          }))}
        />

        <Select
          label="Semester"
          name="semester"
          value={form.semester || ""}
          onChange={handleChange}
          options={SEMESTERS.map((s) => ({
            value: s,
            label: s,
          }))}
        />

        <Select
          label="Section"
          name="section"
          value={form.section || ""}
          onChange={handleChange}
          options={SECTIONS.map((s) => ({
            value: s,
            label: s,
          }))}
        />
      </div>

      {/* SUBMIT */}
      <div className="mt-10">
        <button
          type="submit"
          disabled={submitting}
          className="w-full relative overflow-hidden group bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50"
        >
          <span className="relative">
            {submitting
              ? "Saving..."
              : editingStudent
                ? "Update Student Record"
                : "Register Student"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
