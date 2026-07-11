import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { useTeachers } from "../../context/TeacherContext";
import { useLabs } from "../../context/LabContext";
import AssignProjectStudents from "../../components/teacher/AssignProjectStudents";

const initialForm = {
  title: "",
  description: "",
  technology: "",
  startDate: "",
  dueDate: "",
  labId: "",
};

const Projects = () => {
  const { projects, addProject, deleteProject } = useProjects();

  const { currentUser } = useAuth();

  const { getTeacherByUserId } = useTeachers();

  const { labs } = useLabs();

  const teacher = getTeacherByUserId(currentUser?.id);

  const teacherLabs = labs.filter(
    (lab) => lab.assignedTeacherId === teacher?.id,
  );

  const [form, setForm] = useState(initialForm);

  const [selectedProject, setSelectedProject] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    const selectedLab = teacherLabs.find((lab) => lab.id === form.labId);

    addProject({
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
    <DashboardLayout title="Projects">
      {/* Create Project Form */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-12 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">
          Create New Project
        </h2>
        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <input
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              placeholder="Project Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-24"
              placeholder="Project Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <input
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            placeholder="Technology (e.g., React, Blockchain)"
            name="technology"
            value={form.technology}
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
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm outline-none"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
            <input
              type="date"
              className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-bold text-sm outline-none"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
          <button className="bg-gray-900 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg">
            Create Project
          </button>
        </form>
      </div>

      {/* My Projects List */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            My Projects
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full">
            {projects.filter((p) => p.teacherId === teacher.id).length} Active
            Projects
          </span>
        </div>

        <div className="grid gap-6">
          {projects
            .filter((project) => project.teacherId === teacher.id)
            .map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Info Section */}
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-2xl">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                      {project.technology}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Due: {project.dueDate}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {project.assignedStudents.length} Students Assigned
                    </span>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                  <button
                    className="flex-1 bg-gray-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] px-6 py-4 rounded-2xl transition-all active:scale-95"
                    onClick={() => setSelectedProject(project)}
                  >
                    Assign
                  </button>
                  <button
                    className="flex-1 bg-gray-50 hover:bg-rose-50 text-rose-500 font-black uppercase tracking-widest text-[10px] px-6 py-4 rounded-2xl transition-all active:scale-95"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedProject && (
        <AssignProjectStudents
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Projects;
