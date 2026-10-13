// import { useState } from "react";

// import { useStudents } from "../../context/StudentContext";
// import { useLabs } from "../../context/LabContext";
// import Select from "../common/Select";
// import {
//   DEPARTMENTS,
//   SEMESTERS,
//   SECTIONS,
// } from "../../utils/constants";

// const StudentLabAssignment = () => {
//   const { students, updateStudent } = useStudents();

//   const { labs } = useLabs();

//   const [department, setDepartment] = useState("");
// const [semester, setSemester] = useState("");
// const [section, setSection] = useState("");
// const [labId, setLabId] = useState("");

//   const filteredStudents = students.filter(
//   (student) =>
//     (!department || student.department === department) &&
//     (!semester || String(student.semester) === semester) &&
//     (!section || student.section === section)
// );

//   const toggleLab = (labId) => {
//   if (!student) return;

//   const assignedLabs = student.assignedLabs || [];

//   const updatedLabs = assignedLabs.includes(labId)
//     ? assignedLabs.filter((id) => id !== labId)
//     : [...assignedLabs, labId];

//   console.log("Student Before:", student);
//   console.log("Updated Labs:", updatedLabs);

//   updateStudent(student.id, {
//     assignedLabs: updatedLabs,
//   });

//   console.log("Update Called");
// };

// // console.log("Student:", student);
// console.log("Labs:", labs);

//   return (
//   <div className="border rounded p-5">
//     <h2 className="text-2xl font-bold mb-5">
//       Assign Lab to Students
//     </h2>

//     {/* Department */}

//     <Select
//       label="Department"
//       value={department}
//       onChange={(e) => setDepartment(e.target.value)}
//       options={DEPARTMENTS.map((dept) => ({
//         label: dept,
//         value: dept,
//       }))}
//     />

//     {/* Semester */}

//     <Select
//       label="Semester"
//       value={semester}
//       onChange={(e) => setSemester(e.target.value)}
//       options={SEMESTERS.map((sem) => ({
//         label: sem,
//         value: sem,
//       }))}
//     />

//     {/* Section */}

//     <Select
//       label="Section"
//       value={section}
//       onChange={(e) => setSection(e.target.value)}
//       options={SECTIONS.map((sec) => ({
//         label: sec,
//         value: sec,
//       }))}
//     />

//     <p className="mt-5 font-semibold">
//       Students Found : {filteredStudents.length}
//     </p>

//     {/* Lab */}

//     <div className="mt-5">
//       <label className="font-semibold">
//         Select Lab
//       </label>

//       <select
//         className="border p-2 w-full mt-2"
//         value={labId}
//         onChange={(e) => setLabId(e.target.value)}
//       >
//         <option value="">
//           Select Lab
//         </option>

//         {labs
//           .filter(
//             (lab) =>
//               lab.department === department &&
//               String(lab.assignedSemester) === semester
//           )
//           .map((lab) => (
//             <option
//               key={lab.id}
//               value={lab.id}
//             >
//               {lab.labName}
//             </option>
//           ))}
//       </select>
//     </div>

//     <button
//       onClick={assignLabToStudents}
//       className="border px-5 py-2 mt-6 rounded"
//       disabled={!labId || filteredStudents.length === 0}
//     >
//       Assign Lab To All Students
//     </button>
//   </div>
// );
// };

// export default StudentLabAssignment;

import { useState } from "react";

import Select from "../common/Select";

import { useStudents } from "../../context/StudentContext";
import { useLabs } from "../../context/LabContext";

import { DEPARTMENTS, SEMESTERS, SECTIONS } from "../../utils/constants";

const StudentLabAssignment = () => {
  const { students, updateStudent } = useStudents();

  const { labs } = useLabs();

  const [department, setDepartment] = useState("");

  const [semester, setSemester] = useState("");

  const [section, setSection] = useState("");

  const [labId, setLabId] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      (!department || student.department === department) &&
      (!semester || String(student.semester) === String(semester)) &&
      (!section || student.section === section),
  );

  const availableLabs = labs.filter(
    (lab) =>
      lab.department === department &&
      String(lab.assignedSemester) === String(semester),
  );

  const assignLabToStudents = async () => {
    if (!labId) {
      alert("Please select a lab.");
      return;
    }

    if (filteredStudents.length === 0) {
      alert("No students found.");
      return;
    }

    const studentsToUpdate = filteredStudents.filter(
      (student) => !(student.assignedLabs || []).includes(labId),
    );

    if (studentsToUpdate.length === 0) {
      alert("All filtered students are already assigned to this lab.");
      return;
    }

    try {
      await Promise.all(
        studentsToUpdate.map((student) =>
          updateStudent(student.id, {
            assignedLabs: [...(student.assignedLabs || []), labId],
          }),
        ),
      );

      alert(
        `Successfully assigned ${studentsToUpdate.length} students to the lab.`,
      );
    } catch (error) {
      console.error("Lab assignment failed:", error);
      alert(
        "Some lab assignments may not have been saved. Please refresh the student list and check the backend.",
      );
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Assign Laboratory
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          Configure lab sessions and bulk enrollment
        </p>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Select
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={DEPARTMENTS.map((i) => ({ label: i, value: i }))}
        />
        <Select
          label="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          options={SEMESTERS.map((i) => ({ label: i, value: i }))}
        />
        <Select
          label="Section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          options={SECTIONS.map((i) => ({ label: i, value: i }))}
        />
      </div>

      {/* Lab Selection & Action */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
              Target Laboratory
            </label>
            <select
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 font-black text-sm focus:border-indigo-500 outline-none transition-all"
              value={labId}
              onChange={(e) => setLabId(e.target.value)}
            >
              <option value="">Select an available lab...</option>
              {availableLabs.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.labName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={assignLabToStudents}
            disabled={!labId || filteredStudents.length === 0}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
          >
            Assign to {filteredStudents.length} Students
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-gray-900">
            Eligible Students
          </h3>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            {filteredStudents.length} Records
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              No students match current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white border border-gray-500 p-5 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-colors"
              >
                <div>
                  <p className="font-black text-gray-900 text-sm">
                    {student.name}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                    {student.usn}
                  </p>
                </div>
                <div className="text-[9px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-lg">
                  {student.assignedLabs?.length || 0} LABS
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLabAssignment;
