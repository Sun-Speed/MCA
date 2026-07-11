import { Pencil, Trash2, UserCog, Mail, Hash, Building2 } from "lucide-react";
import DataTable from "../common/DataTable";
import { useClerks } from "../../context/ClerkContext";
import { useAuth } from "../../context/AuthContext";

const ClerkTable = ({ onEdit }) => {
  const { clerks, deleteClerk } = useClerks();
  const { deleteUser } = useAuth();

  const columns = [
    {
      title: "Clerk Details",
      key: "name",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <UserCog size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-800">{c.name}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Mail size={12} /> {c.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Employee ID",
      key: "employeeId",
      render: (c) => <span className="font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded text-sm">{c.employeeId}</span>,
    },
    {
      title: "Department",
      key: "department",
      render: (c) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 size={16} className="text-gray-400" />
          <span className="font-medium">{c.department}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (clerk) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => onEdit(clerk)}
            className="p-2 hover:bg-violet-50 text-violet-600 rounded-lg transition-colors"
            title="Edit Clerk"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => { deleteClerk(clerk.id); deleteUser(clerk.userId); }}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
            title="Delete Clerk"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Clerk Directory</h2>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{clerks.length} Clerks</span>
      </div>
      
      <DataTable
        columns={columns}
        data={clerks}
        emptyMessage="No Clerks Found"
      />
    </div>
  );
};

export default ClerkTable;