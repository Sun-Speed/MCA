// // import { useState } from "react";

// // import { useProjects } from "../../context/ProjectContext";

// // const StudentProjectCard = ({ project, student }) => {
// //   const { updateProjectStudent } = useProjects();

// //   const assignedStudent = project.assignedStudents.find(
// //     (s) => s.studentId === student.id,
// //   );

// //   const [github, setGithub] = useState(assignedStudent.github || "");

// //   const [demo, setDemo] = useState(assignedStudent.demo || "");

// //   const [zip, setZip] = useState(assignedStudent.zip || "");

// //   const submit = () => {
// //     updateProjectStudent(project.id, student.id, {
// //       github,

// //       demo,

// //       zip,

// //       status: "SUBMITTED",

// //       submittedAt: new Date().toLocaleString(),
// //     });

// //     alert("Project Submitted Successfully");
// //   };

// //   return (
// //     <div className="border rounded-xl p-6">
// //       <h2 className="text-2xl font-bold">{project.title}</h2>

// //       <p className="mt-3">{project.description}</p>

// //       <p className="mt-3">Deadline : {project.deadline}</p>

// //       <p className="mt-3">Status : {assignedStudent.status}</p>

// //       <div className="mt-5">
// //         <label>GitHub Repository</label>

// //         <input
// //           className="border w-full p-2 mt-2"
// //           value={github}
// //           onChange={(e) => setGithub(e.target.value)}
// //         />
// //       </div>

// //       <div className="mt-5">
// //         <label>Live Demo</label>

// //         <input
// //           className="border w-full p-2 mt-2"
// //           value={demo}
// //           onChange={(e) => setDemo(e.target.value)}
// //         />
// //       </div>

// //       <div className="mt-5">
// //         <label>ZIP File Name</label>

// //         <input
// //           className="border w-full p-2 mt-2"
// //           value={zip}
// //           onChange={(e) => setZip(e.target.value)}
// //         />
// //       </div>

// //       <button onClick={submit} className="border px-5 py-2 mt-6">
// //         Submit Project
// //       </button>

// //       <hr className="my-5" />

// //       <p>
// //         <strong>Submitted :</strong>

// //         {assignedStudent.submittedAt || "--"}
// //       </p>

// //       <p>
// //         <strong>Marks :</strong>

// //         {assignedStudent.marks || "--"}
// //       </p>

// //       <p>
// //         <strong>Teacher Remarks :</strong>

// //         {assignedStudent.teacherRemarks || "--"}
// //       </p>
// //     </div>
// //   );
// // };

// // export default StudentProjectCard;

// const StudentProjectCard = ({ project, student }) => {

//   const studentProject = project.assignedStudents.find(
//     (s) => String(s.studentId) === String(student.id)
//   );

//   if (!studentProject) return null;

//   return (
//     <div className="border rounded p-5">

//       <h3 className="text-xl font-bold">
//         {project.title}
//       </h3>

//       <p className="mt-2">
//         {project.description}
//       </p>

//       <p className="mt-2">
//         Technology : {project.technology}
//       </p>

//       <p className="mt-2">
//         Due Date : {project.dueDate}
//       </p>

//       <hr className="my-4"/>

//       <p>
//         <strong>Status :</strong>{" "}
//         {studentProject.status}
//       </p>

//       <p>
//         <strong>Marks :</strong>{" "}
//         {studentProject.marks || "--"}
//       </p>

//       <p>
//         <strong>Teacher Remarks :</strong>{" "}
//         {studentProject.teacherRemarks || "--"}
//       </p>

//     </div>
//   );
// };

// export default StudentProjectCard;

import { useState } from "react";

const StudentProjectCard = ({ project, student, updateProjectStudent }) => {
  const studentProject = project.assignedStudents.find(
    (s) => String(s.studentId) === String(student.id),
  );

  const [marks, setMarks] = useState(studentProject?.marks || "");

  const [remarks, setRemarks] = useState(studentProject?.teacherRemarks || "");

  const save = () => {
    updateProjectStudent(project.id, student.id, {
      marks,
      teacherRemarks: remarks,
    });

    alert("Project Updated");
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-indigo-100 overflow-hidden">
      {/* Ambient Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest">
            {project.technology}
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Due: {project.dueDate}
          </div>
        </div>
        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-3">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md">
          {project.description}
        </p>
      </div>

      {/* Form Grid - HIGHLIGHTED INPUTS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
            Project Status
          </label>
          <div className="relative">
            <select
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-black text-gray-900 appearance-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              value={studentProject?.status || "PENDING"}
              onChange={(e) =>
                updateProjectStudent(project.id, student.id, {
                  status: e.target.value,
                })
              }
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <div className="absolute right-4 top-4 pointer-events-none opacity-40">
              ▼
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
            Final Marks
          </label>
          <input
            type="number"
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-black text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="00"
          />
        </div>
      </div>

      {/* Remarks Area - HIGHLIGHTED */}
      <div className="relative z-10 mt-6 space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
          Teacher Remarks
        </label>
        <textarea
          rows={2}
          className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-black text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Type feedback here..."
        />
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          {student.name} • {student.usn}
        </div>
        <button
          className="bg-gray-900 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl hover:scale-[1.02] hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
          onClick={save}
        >
          Save Evaluation
        </button>
      </div>
    </div>
  );
};

export default StudentProjectCard;
