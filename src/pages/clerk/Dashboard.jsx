import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useStudents } from "../../context/StudentContext";

import StudentForm from "../../components/student/StudentForm";
import StudentTable from "../../components/student/StudentTable";

const ClerkDashboard = () => {
  const { students } = useStudents();

  const [search, setSearch] = useState("");
  // const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    semester: "",
    section: "",
    department: "",
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        searchText === "" ||
        student.name.toLowerCase().includes(searchText) ||
        student.usn.toLowerCase().includes(searchText);

      const matchesSemester =
        filters.semester === "" ||
        String(student.semester) === String(filters.semester);

      const matchesSection =
        filters.section === "" || student.section === filters.section;

      const matchesDepartment =
        filters.department === "" || student.department === filters.department;

      return (
        matchesSearch && matchesSemester && matchesSection && matchesDepartment
      );
    });
  }, [students, search, filters]);

  return (
    <DashboardLayout title="Clerk Dashboard">
      {/* Header */}

      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[2rem] p-10 shadow-sm mb-12">
        {/* Decorative Ambient Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-20 -mt-20 opacity-70" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-50 rounded-full blur-[80px] -ml-20 -mb-20 opacity-70" />

        {/* Content Layer */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Student Management
          </h1>

          <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-lg">
            A centralized command hub for managing your student registry,
            trackings, and academic credentials with absolute precision.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Total Students",
            value: students.length,
            color: "text-gray-900",
          },
          {
            label: "Departments",
            value: [...new Set(students.map((s) => s.department))].length,
            color: "text-indigo-600",
          },
          {
            label: "Semesters",
            value: [...new Set(students.map((s) => s.semester))].length,
            color: "text-violet-600",
          },
          {
            label: "Sections",
            value: [...new Set(students.map((s) => s.section))].length,
            color: "text-cyan-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              {stat.label}
            </p>
            <h2
              className={`text-5xl font-black ${stat.color} tracking-tighter`}
            >
              {stat.value}
            </h2>

            {/* Decorative hover accent */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-50 rounded-b-3xl overflow-hidden">
              <div
                className={`h-full w-0 group-hover:w-full transition-all duration-700 ${stat.color.replace("text", "bg")}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Filter Directory
          </h2>
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
            {students.length} Records Active
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search name or USN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
          />

          {/* Filters */}
          {[
            {
              key: "department",
              label: "All Departments",
              options: [...new Set(students.map((s) => s.department))],
            },
            {
              key: "semester",
              label: "All Semesters",
              options: [...new Set(students.map((s) => s.semester))].sort(),
            },
            {
              key: "section",
              label: "All Sections",
              options: [...new Set(students.map((s) => s.section))],
            },
          ].map((filter) => (
            <select
              key={filter.key}
              className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-black text-sm text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
              value={filters[filter.key]}
              onChange={(e) =>
                setFilters({ ...filters, [filter.key]: e.target.value })
              }
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt} value={opt}>
                  {filter.key === "semester"
                    ? `Semester ${opt}`
                    : filter.key === "section"
                      ? `Section ${opt}`
                      : opt}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Student Table */}

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Student Records
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Comprehensive student directory
            </p>
          </div>

          <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
              {filteredStudents.length} Students Found
            </span>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden border border-gray-100 rounded-2xl">
          <StudentTable students={filteredStudents} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClerkDashboard;