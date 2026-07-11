import { useState } from "react";

import { useStudents } from "../../context/StudentContext";
import { useProjects } from "../../context/ProjectContext";
import { useLabs } from "../../context/LabContext";

const AssignProjectStudents = ({ project, onClose }) => {
  const { students } = useStudents();

  const { assignStudents } = useProjects();

  const { labs } = useLabs();

  const [selectedStudents, setSelectedStudents] = useState(
  project.assignedStudents?.map((student) => student.studentId) || []
);

  const lab = labs.find((l) => l.id === project.labId);

  console.log("Project :", project);
console.log("Labs :", labs);
console.log("Students :", students);

  const eligibleStudents = students.filter((student) =>
  student.assignedLabs?.includes(project.labId)
);

  console.log("Eligible :", eligibleStudents);

 const toggleStudent = (studentId) => {
  if (selectedStudents.includes(studentId)) {
    setSelectedStudents((prev) =>
      prev.filter((id) => id !== studentId)
    );
  } else {
    setSelectedStudents((prev) => [
      ...prev,
      studentId,
    ]);
  }
};

  const save = () => {
    assignStudents(project.id, selectedStudents);

    alert("Students Assigned Successfully");

    onClose();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl max-w-lg w-full">
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-xl font-black text-gray-900 tracking-tight">Assign Students</h2>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors font-black">✕</button>
  </div>

  {eligibleStudents.length === 0 ? (
    <div className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs">
      No eligible students found.
    </div>
  ) : (
    <>
      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
        {eligibleStudents.map((student) => {
          const isSelected = selectedStudents.includes(student.id);
          return (
            <label
              key={student.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected 
                  ? "bg-indigo-50 border-indigo-500 shadow-inner" 
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                className="w-5 h-5 accent-indigo-600 cursor-pointer"
                checked={isSelected}
                onChange={() => toggleStudent(student.id)}
              />
              <div className="flex flex-col">
                <span className={`font-black text-sm ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                  {student.name}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {student.usn}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={save}
          className="flex-1 bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
        >
          Confirm Assignment
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-600 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-gray-200 transition-all"
        >
          Cancel
        </button>
      </div>
    </>
  )}
</div>
  );
};

export default AssignProjectStudents;