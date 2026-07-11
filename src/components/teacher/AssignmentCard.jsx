import { useState } from "react";

const AssignmentCard = ({ assignment, student, updateAssignment }) => {
  const studentAssignment = assignment.assignedStudents.find(
    (s) => String(s.studentId) === String(student.id),
  );

  const [remarks, setRemarks] = useState(
    studentAssignment?.teacherRemarks || "",
  );

  const [marks, setMarks] = useState(studentAssignment?.marks || "");

  const updateStudent = (updates) => {
    const updatedStudents = assignment.assignedStudents.map((s) =>
      String(s.studentId) === String(student.id) ? { ...s, ...updates } : s,
    );

    updateAssignment(assignment.id, {
      assignedStudents: updatedStudents,
    });
  };

  const save = () => {
    updateStudent({
      teacherRemarks: remarks,
      marks,
    });

    alert("Assignment Updated");
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header Section */}
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900">{assignment.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            Assignment
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Due: {assignment.deadline}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          {assignment.description}
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
            Status
          </label>
          <select
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
            value={studentAssignment?.status || "PENDING"}
            onChange={(e) => updateStudent({ status: e.target.value })}
          >
            <option value="PENDING">Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="EVALUATED">Evaluated</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
            Marks
          </label>
          <input
            type="number"
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter marks"
          />
        </div>
      </div>

      {/* Remarks Area */}
      <div className="mt-6 space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
          Teacher Remarks
        </label>
        <textarea
          rows={2}
          className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Type feedback here..."
        />
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex justify-end">
        <button
          className="bg-gray-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl transition-all shadow-lg shadow-gray-200 active:scale-95"
          onClick={save}
        >
          Save Assignment
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
