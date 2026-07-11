import { Link } from "react-router-dom";

import DataTable from "../common/DataTable";
import Button from "../common/Button";

// import { Link } from "react-router-dom";

import { useStudents } from "../../context/StudentContext";

const StudentTable = ({ students, onEdit }) => {
  const { deleteStudent } = useStudents();

  // Define columns with clean metadata
  const columns = [
    { title: "Student Info", key: "info" },
    { title: "Department", key: "department" },
    { title: "Semester", key: "semester" },
    { title: "Section", key: "section" },
    { title: "Actions", key: "actions" },
  ];

  console.log("Received:", students);
  console.log("Length:", students?.length);

  return (
    <div className="overflow-x-auto">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="border-b border-gray-100">
        {columns.map((col) => (
          <th
            key={col.key}
            className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"
          >
            {col.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {students.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length}
            className="p-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest"
          >
            No students found in records
          </td>
        </tr>
      ) : (
        students.map((student) => (
          <tr
            key={student.id}
            className="hover:bg-gray-50/50 transition-colors"
          >
            {/* Student Info Cell */}
            <td className="p-6">
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900">
                  {student.name}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  {student.usn}
                </span>
              </div>
            </td>

            {/* Data Cells */}
            <td className="p-6 text-sm font-bold text-gray-600">
              {student.department}
            </td>
            <td className="p-6 text-sm font-bold text-gray-600 tabular-nums">
              SEM {student.semester}
            </td>
            <td className="p-6 text-sm font-bold text-gray-600 uppercase">
              SEC {student.section}
            </td>

            {/* Actions Cell - Always Visible */}
            <td className="p-6">
              <div className="flex items-center gap-4">
                {onEdit && (
                  <button
                    onClick={() => onEdit(student)}
                    className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${student.name}?`))
                      deleteStudent(student.id);
                  }}
                  className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-700 transition-colors"
                >
                  Delete
                </button>
                <Link
                  to={`/clerk/student/${student.id}`}
                  className="text-[10px] font-black uppercase text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  Profile
                </Link>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
  );
};

export default StudentTable;
