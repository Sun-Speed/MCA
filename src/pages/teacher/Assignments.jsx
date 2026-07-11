import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useAssignments } from "../../context/AssignmentContext";
import { useAuth } from "../../context/AuthContext";
import { useTeachers } from "../../context/TeacherContext";
import { useLabs } from "../../context/LabContext";

import AssignAssignmentStudents from "../../components/teacher/AssignAssignmentStudents";

const initialForm = {
  title: "",
  description: "",
  maxMarks: "",
  dueDate: "",
  labId: "",
};

const Assignments = () => {
  const { assignments, addAssignment, deleteAssignment } = useAssignments();

  const { currentUser } = useAuth();

  const { getTeacherByUserId } = useTeachers();

  const { labs } = useLabs();

  const teacher = getTeacherByUserId(currentUser?.id);

  const teacherLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id,
  );

  const [form, setForm] = useState(initialForm);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    const selectedLab = teacherLabs.find((lab) => lab.id === form.labId);

    addAssignment({
      ...form,

      teacherId: teacher.id,

      teacherName: teacher.name,

      department: selectedLab.department,

      semester: selectedLab.assignedSemester,

      section: selectedLab.assignedSection,
    });

    setForm(initialForm);
  };

  return (
    <DashboardLayout title="Assignments">
      {/* Create Assignment Form */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-12 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
          Create New Assignment
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <input
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              placeholder="Assignment Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-24"
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <input
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            placeholder="Maximum Marks"
            name="maxMarks"
            value={form.maxMarks}
            onChange={handleChange}
          />
          <select
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-black text-sm text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            name="labId"
            value={form.labId}
            onChange={handleChange}
          >
            <option value="">Select Associated Lab</option>
            {teacherLabs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.labName}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1 mb-2 block">
              Deadline
            </label>
            <input
              type="date"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
          <button className="md:col-span-2 bg-gray-900 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg">
            Create Assignment
          </button>
        </form>
      </div>

      {/* My Assignments List */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          Active Assignments
        </h2>
        <div className="grid gap-4">
          {assignments
            .filter((a) => a.teacherId === teacher.id)
            .map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-between hover:shadow-lg transition-all hover:border-indigo-100"
              >
                <div>
                  <h3 className="font-black text-lg text-gray-900">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-lg">
                    {assignment.description}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      Max Marks: {assignment.maxMarks}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Due: {assignment.dueDate}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {assignment.assignedStudents.length} Students Assigned
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-gray-50 hover:bg-indigo-50 text-gray-900 font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl transition-all"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    Assign
                  </button>
                  <button
                    className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-all"
                    onClick={() => deleteAssignment(assignment.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedAssignment && (
        <AssignAssignmentStudents
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Assignments;
