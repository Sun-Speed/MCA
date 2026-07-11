import DashboardLayout from "../../components/layout/DashboardLayout";

import LabForm from "../../components/hod/LabForm";
import LabTable from "../../components/hod/LabTable";
import AssignLabForm from "../../components/hod/AssignLabForm";

const Labs = () => {
  return (
    <DashboardLayout title="Lab Management">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
        {/* Soft Decorative Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-60" />

        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-900">
            Lab Management Portal
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl">
            Create new labs, track existing infrastructure, and assign faculty
            members to specific academic sessions. Use the table below to manage
            resources and maintain organizational efficiency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <LabForm />

        <LabTable />

        <AssignLabForm />
      </div>
    </DashboardLayout>
  );
};

export default Labs;
