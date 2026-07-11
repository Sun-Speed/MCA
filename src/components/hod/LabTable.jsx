import { useLabs } from "../../context/LabContext";

import { Trash2, FlaskConical, Building2, Users } from "lucide-react";

const LabTable = () => {
  const { labs, deleteLab } = useLabs();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Laboratory Registry</h2>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{labs.length} Active Labs</span>
      </div>

      {labs.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <FlaskConical size={48} className="mx-auto mb-4 opacity-20" />
          <p>No laboratories found. Add your first lab to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50">
                <th className="px-6 py-4 font-bold">Lab Details</th>
                <th className="px-6 py-4 font-bold">Department</th>
                <th className="px-6 py-4 font-bold">Capacity</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {labs.map((lab) => (
                <tr key={lab.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FlaskConical size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{lab.labName}</p>
                        <p className="text-xs text-gray-500 font-mono">{lab.labCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                      {lab.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={16} className="text-gray-400" />
                      {lab.capacity}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteLab(lab.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LabTable;