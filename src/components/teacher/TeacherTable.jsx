import DataTable from "../common/DataTable";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

import { useTeachers } from "../../context/TeacherContext";
import { BookOpen, Pencil, Trash2  } from "lucide-react";

const TeacherTable = ({ onEdit }) => {
  const { teachers, deleteTeacher } = useTeachers();
  const { deleteUser } = useAuth();

  const columns = [
  {
    title: "Employee ID",
    key: "employeeId",
    render: (t) => <span className="font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded text-sm">{t.employeeId}</span>,
  },
  {
    title: "Teacher Name",
    key: "name",
    render: (t) => <span className="font-semibold text-gray-800">{t.name}</span>,
  },
  {
    title: "Email",
    key: "email",
    render: (t) => <span className="text-gray-500 text-sm">{t.email}</span>,
  },
  {
    title: "Department",
    key: "department",
    render: (t) => <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{t.department}</span>,
  },
  {
    title: "Actions",
    key: "actions",
    render: (teacher) => (
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(teacher)}
          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
          title="Edit"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => { deleteTeacher(teacher.id); deleteUser(teacher.userId); }}
          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
  },
];

  return (
    <DataTable
      columns={columns}
      data={teachers}
      emptyMessage="No Teachers Found"
    />
  );
};

export default TeacherTable;
