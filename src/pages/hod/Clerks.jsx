import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import ClerkForm from "../../components/hod/ClerkForm";
import ClerkTable from "../../components/hod/ClerkTable";

import { hodMenu } from "../../data/menu";
import { UserCog } from "lucide-react";

const Clerks = () => {
  const [editingClerk, setEditingClerk] = useState(null);

  return (
    <DashboardLayout title="Clerk Management" menu={hodMenu}>
      <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-60" />

        {/* Text Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Clerk Management
          </h1>
          <p className="mt-2 text-gray-500 text-lg max-w-xl">
            Manage administrative staff, assign roles, and maintain secure
            access control within the institution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ClerkForm
          editingClerk={editingClerk}
          onFinishEdit={() => setEditingClerk(null)}
        />

        <ClerkTable onEdit={setEditingClerk} />
      </div>
    </DashboardLayout>
  );
};

export default Clerks;
