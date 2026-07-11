import { useState } from "react";

import { useStudents } from "../../context/StudentContext";
import { useAssignments } from "../../context/AssignmentContext";

const AssignAssignmentStudents = ({
  assignment,
  onClose,
}) => {
  const { students } = useStudents();

  const { assignStudents } =
    useAssignments();

  const [selectedStudents, setSelectedStudents] = useState(
  assignment.assignedStudents?.map(
    (student) => student.studentId
  ) || []
);

  const eligibleStudents =
    students.filter((student) =>
      student.assignedLabs?.includes(
        assignment.labId
      )
    );

  const toggleStudent = (studentId) => {
    if (
      selectedStudents.includes(studentId)
    ) {
      setSelectedStudents((prev) =>
        prev.filter(
          (id) => id !== studentId
        )
      );
    } else {
      setSelectedStudents((prev) => [
        ...prev,
        studentId,
      ]);
    }
  };

  const save = () => {
    assignStudents(
      assignment.id,
      selectedStudents
    );

    alert("Assignment Assigned");

    onClose();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mt-8">
  <div className="mb-8">
    <h2 className="text-xl font-black text-gray-900 tracking-tight">Assign Students</h2>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
      Select students to participate in this Assignment
    </p>
  </div>

  <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
    {eligibleStudents.map((student) => {
      const isSelected = selectedStudents.includes(student.id);
      return (
        <label
          key={student.id}
          className={`group flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
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
      className="flex-1 bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95"
    >
      Save Assignments
    </button>
    <button
      onClick={onClose}
      className="flex-1 bg-gray-100 text-gray-600 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
    >
      Cancel
    </button>
  </div>
</div>
  );
};
export default AssignAssignmentStudents;