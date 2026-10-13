// import { createContext, useContext, useEffect, useState } from "react";

// const StudentContext = createContext();

// const initialStudents = [
//   {
//     id: 1,

//     usn: "1RV23CS001",

//     name: "Rahul",

//     department: "Computer Science",

//     semester: 5,

//     section: "A",

//     subjects: [
//       {
//         subjectCode: "CSL51",
//         subjectName: "Python Lab",
//       },
//     ],

//     activities: {
//       projects: [
//         {
//           title: "Library Management",
//           status: "Completed",
//         },
//       ],

//       internals: [
//         {
//           test: "Internal 1",
//           marks: 24,
//           outOf: 30,
//         },
//       ],

//       assignments: [
//         {
//           title: "Assignment 1",
//           status: "Completed",
//         },
//       ],

//       certificates: [],

//       remarks: "",

//       labPerformance: "Good",
//     },
//   },
// ];

// export const StudentProvider = ({ children }) => {
//   const [students, setStudents] = useState(() => {
//     const saved = localStorage.getItem("students");

//     return saved ? JSON.parse(saved) : initialStudents;
//   });

//   useEffect(() => {
//     localStorage.setItem("students", JSON.stringify(students));
//   }, [students]);

//   // ========================
//   // Student CRUD
//   // ========================

//   const addStudent = (student) => {
//     setStudents((prev) => [
//       ...prev,
//       {
//         id: Date.now(),

//         ...student,

//         assignedLabs: student.assignedLabs || [],

//         activities: {
//           projects: [],
//           internals: [],
//           assignments: [],
//           certificates: [],

//           remarks: "",

//           labPerformance: {
//             rating: "GOOD",

//             teacherRemarks: "",
//           },
//         },
//       },
//     ]);
//   };

//   const updateStudent = (id, updatedData) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === id
//           ? {
//               ...student,
//               ...updatedData,
//             }
//           : student,
//       ),
//     );
//   };

//   const deleteStudent = (id) => {
//     setStudents((prev) => prev.filter((student) => student.id !== id));
//   };

//   // ========================
//   // Subject Management
//   // ========================

//   const assignSubject = (studentId, subject) => {
//     setStudents((prev) =>
//       prev.map((student) => {
//         if (student.id !== studentId) return student;

//         const exists = student.subjects.some(
//           (s) => s.subjectCode === subject.subjectCode,
//         );

//         if (exists) return student;

//         return {
//           ...student,
//           subjects: [...student.subjects, subject],
//         };
//       }),
//     );
//   };

//   // ========================
//   // Projects
//   // ========================

//   const addProject = (studentId, project) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === studentId
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 projects: [...student.activities.projects, project],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Internals
//   // ========================

//   const addInternalMark = (studentId, internal) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === studentId
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 internals: [...student.activities.internals, internal],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Assignments
//   // ========================

//   const addAssignment = (studentId, assignment) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === studentId
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 assignments: [...student.activities.assignments, assignment],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Certificates
//   // ========================

//   const addCertificate = (studentId, certificate) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === studentId
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 certificates: [...student.activities.certificates, certificate],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Remarks
//   // ========================

//   const updateRemarks = (studentId, remarks) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === studentId
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 remarks,
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Lab Performance
//   // ========================

//   const updateLabPerformance = (studentId, performance) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === studentId
//           ? {
//               ...student,

//               activities: {
//                 ...student.activities,

//                 labPerformance: performance,
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   const getStudentById = (id) =>
//     students.find((student) => String(student.id) === String(id));

//   return (
//     <StudentContext.Provider
//       value={{
//         students,

//         addStudent,

//         updateStudent,

//         deleteStudent,

//         assignSubject,

//         addProject,

//         addInternalMark,

//         addAssignment,

//         addCertificate,

//         updateRemarks,

//         updateLabPerformance,

//         getStudentById,
//       }}
//     >
//       {children}
//     </StudentContext.Provider>
//   );
// };

// export const useStudents = () => useContext(StudentContext);

// import { createContext, useContext, useEffect, useState } from "react";

// const StudentContext = createContext();

// const STORAGE_KEY = "students";

// // Start with an empty list when no saved students exist.
// const loadStudents = () => {
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY);

//     if (!saved) return [];

//     const parsed = JSON.parse(saved);

//     return Array.isArray(parsed) ? parsed : [];
//   } catch (error) {
//     console.error("Unable to load students:", error);
//     return [];
//   }
// };

// export const StudentProvider = ({ children }) => {
//   const [students, setStudents] = useState(loadStudents);

//   // Persist student details, including the uploaded photo.
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
//     } catch (error) {
//       console.error("Unable to save students:", error);
//     }
//   }, [students]);

//   // ========================
//   // Student CRUD
//   // ========================

//   const addStudent = (student) => {
//     const newStudent = {
//       ...student,
//       id: Date.now(),

//       assignedLabs: student.assignedLabs || [],
//       subjects: student.subjects || [],
//       photo: student.photo || "",

//       activities: {
//         projects: [],
//         internals: [],
//         assignments: [],
//         certificates: [],
//         remarks: "",
//         labPerformance: {
//           rating: "GOOD",
//           teacherRemarks: "",
//         },
//         ...(student.activities || {}),
//       },
//     };

//     setStudents((prev) => [...prev, newStudent]);
//   };

//   const updateStudent = (id, updatedData) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         String(student.id) === String(id)
//           ? {
//               ...student,
//               ...updatedData,
//               photo:
//                 updatedData.photo !== undefined
//                   ? updatedData.photo
//                   : student.photo || "",
//             }
//           : student,
//       ),
//     );
//   };

//   const deleteStudent = (id) => {
//     setStudents((prev) =>
//       prev.filter((student) => String(student.id) !== String(id)),
//     );
//   };

//   // ========================
//   // Subject Management
//   // ========================

//   const assignSubject = (studentId, subject) => {
//     setStudents((prev) =>
//       prev.map((student) => {
//         if (String(student.id) !== String(studentId)) {
//           return student;
//         }

//         const subjects = student.subjects || [];

//         const exists = subjects.some(
//           (s) => s.subjectCode === subject.subjectCode,
//         );

//         if (exists) return student;

//         return {
//           ...student,
//           subjects: [...subjects, subject],
//         };
//       }),
//     );
//   };

//   // ========================
//   // Projects
//   // ========================

//   const addProject = (studentId, project) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         String(student.id) === String(studentId)
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 projects: [...(student.activities?.projects || []), project],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Internals
//   // ========================

//   const addInternalMark = (studentId, internal) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         String(student.id) === String(studentId)
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 internals: [...(student.activities?.internals || []), internal],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Assignments
//   // ========================

//   const addAssignment = (studentId, assignment) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         String(student.id) === String(studentId)
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 assignments: [
//                   ...(student.activities?.assignments || []),
//                   assignment,
//                 ],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Certificates
//   // ========================

//   const addCertificate = (studentId, certificate) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         String(student.id) === String(studentId)
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 certificates: [
//                   ...(student.activities?.certificates || []),
//                   certificate,
//                 ],
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Remarks
//   // ========================

//   const updateRemarks = (studentId, remarks) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         String(student.id) === String(studentId)
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 remarks,
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Lab Performance
//   // ========================

//   const updateLabPerformance = (studentId, performance) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         String(student.id) === String(studentId)
//           ? {
//               ...student,
//               activities: {
//                 ...student.activities,
//                 labPerformance: performance,
//               },
//             }
//           : student,
//       ),
//     );
//   };

//   // ========================
//   // Find Student
//   // ========================

//   const getStudentById = (id) =>
//     students.find((student) => String(student.id) === String(id));

//   return (
//     <StudentContext.Provider
//       value={{
//         students,
//         addStudent,
//         updateStudent,
//         deleteStudent,
//         assignSubject,
//         addProject,
//         addInternalMark,
//         addAssignment,
//         addCertificate,
//         updateRemarks,
//         updateLabPerformance,
//         getStudentById,
//       }}
//     >
//       {children}
//     </StudentContext.Provider>
//   );
// };

// export const useStudents = () => useContext(StudentContext);

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../services/api";

const StudentContext = createContext(null);

const ACTIVITIES_KEY = "studentActivities";

const createDefaultActivities = () => ({
  projects: [],
  internals: [],
  assignments: [],
  certificates: [],
  remarks: "",
  labPerformance: {
    rating: "GOOD",
    teacherRemarks: "",
  },
});

const loadActivities = () => {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveActivities = (activities) => {
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error("Unable to save student activities:", error);
  }
};

const normalizeStudent = (student, activitiesCache = {}) => ({
  ...student,
  assignedLabs: student.assignedLabs || [],
  subjects: student.subjects || [],
  photo: student.photo || "",
  activities: {
    ...createDefaultActivities(),
    ...(activitiesCache[String(student.id)] || {}),
  },
});

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log(students);

  // Load students from our FastAPI backend.
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/students");
      const activitiesCache = loadActivities();

      setStudents(
        data.map((student) => normalizeStudent(student, activitiesCache)),
      );
    } catch (err) {
      setError(err.message || "Unable to load students.");
      console.error("Unable to load students:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Save academic activities locally without storing student photos
  // or replacing the backend's student records.
  const persistActivities = (studentId, activities) => {
    const cache = loadActivities();

    cache[String(studentId)] = activities;
    saveActivities(cache);
  };

  const updateLocalActivities = (studentId, updater) => {
    setStudents((previous) =>
      previous.map((student) => {
        if (String(student.id) !== String(studentId)) {
          return student;
        }

        const activities = updater({
          ...createDefaultActivities(),
          ...(student.activities || {}),
        });

        persistActivities(studentId, activities);

        return { ...student, activities };
      }),
    );
  };

  // ========================
  // Student CRUD - API
  // ========================

  const addStudent = async (student) => {
    setError("");

    const created = await apiRequest("/students", {
      method: "POST",
      body: JSON.stringify({
        usn: student.usn,
        name: student.name,
        department: student.department,
        semester: String(student.semester),
        section: student.section,
        assignedLabs: student.assignedLabs || [],
        photo: student.photo || null,
        rollNumber: student.rollNumber || null,
      }),
    });

    const normalized = normalizeStudent(created);

    setStudents((previous) => [...previous, normalized]);

    return normalized;
  };

  // const updateStudent = async (id, updatedData) => {
  //   setError("");

  //   const existing = students.find(
  //     (student) => String(student.id) === String(id),
  //   );

  //   if (!existing) {
  //     throw new Error("Student not found.");
  //   }

  //   const updated = await apiRequest(`/students/${id}`, {
  //     method: "PUT",
  //     body: JSON.stringify({
  //       usn: updatedData.usn,
  //       name: updatedData.name,
  //       department: updatedData.department,
  //       semester: String(updatedData.semester),
  //       section: updatedData.section,
  //       assignedLabs: updatedData.assignedLabs || [],
  //       photo: updatedData.photo || null,
  //       rollNumber: updatedData.rollNumber || null,
  //     }),
  //   });

  //   const normalized = normalizeStudent(updated, {
  //     [String(id)]: existing.activities || createDefaultActivities(),
  //   });

  //   setStudents((previous) =>
  //     previous.map((student) =>
  //       String(student.id) === String(id) ? normalized : student,
  //     ),
  //   );

  //   return normalized;
  // };

  const updateStudent = async (id, updatedData) => {
    setError("");

    const existing = students.find(
      (student) => String(student.id) === String(id),
    );

    if (!existing) {
      throw new Error("Student not found.");
    }

    // Merge existing fields with the requested updates.
    const merged = {
      ...existing,
      ...updatedData,
      semester: String(updatedData.semester ?? existing.semester),
      assignedLabs: updatedData.assignedLabs ?? existing.assignedLabs ?? [],
      photo: updatedData.photo ?? existing.photo ?? null,
      rollNumber: updatedData.rollNumber ?? existing.rollNumber ?? null,
    };

    const updated = await apiRequest(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        usn: merged.usn,
        name: merged.name,
        department: merged.department,
        semester: merged.semester,
        section: merged.section,
        assignedLabs: merged.assignedLabs,
        photo: merged.photo,
        rollNumber: merged.rollNumber,
      }),
    });

    const normalized = normalizeStudent(updated, {
      [String(id)]: existing.activities || createDefaultActivities(),
    });

    setStudents((previous) =>
      previous.map((student) =>
        String(student.id) === String(id) ? normalized : student,
      ),
    );

    return normalized;
  };

  const deleteStudent = async (id) => {
    await apiRequest(`/students/${id}`, {
      method: "DELETE",
    });

    setStudents((previous) =>
      previous.filter((student) => String(student.id) !== String(id)),
    );
  };

  // ========================
  // Subject Management
  // ========================

  const assignSubject = (studentId, subject) => {
    setStudents((previous) =>
      previous.map((student) => {
        if (String(student.id) !== String(studentId)) return student;

        const subjects = student.subjects || [];

        if (subjects.some((item) => item.subjectCode === subject.subjectCode)) {
          return student;
        }

        return {
          ...student,
          subjects: [...subjects, subject],
        };
      }),
    );
  };

  // ========================
  // Projects
  // ========================

  const addProject = (studentId, project) => {
    updateLocalActivities(studentId, (activities) => ({
      ...activities,
      projects: [...activities.projects, project],
    }));
  };

  // ========================
  // Internals
  // ========================

  const addInternalMark = (studentId, internal) => {
    updateLocalActivities(studentId, (activities) => ({
      ...activities,
      internals: [...activities.internals, internal],
    }));
  };

  // ========================
  // Assignments
  // ========================

  const addAssignment = (studentId, assignment) => {
    updateLocalActivities(studentId, (activities) => ({
      ...activities,
      assignments: [...activities.assignments, assignment],
    }));
  };

  // ========================
  // Certificates
  // ========================

  const addCertificate = (studentId, certificate) => {
    updateLocalActivities(studentId, (activities) => ({
      ...activities,
      certificates: [...activities.certificates, certificate],
    }));
  };

  // ========================
  // Remarks
  // ========================

  const updateRemarks = (studentId, remarks) => {
    updateLocalActivities(studentId, (activities) => ({
      ...activities,
      remarks,
    }));
  };

  // ========================
  // Lab Performance
  // ========================

  const updateLabPerformance = (studentId, performance) => {
    updateLocalActivities(studentId, (activities) => ({
      ...activities,
      labPerformance: performance,
    }));
  };

  // ========================
  // Find Student
  // ========================

  const getStudentById = (id) =>
    students.find((student) => String(student.id) === String(id));

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        fetchStudents,
        addStudent,
        updateStudent,
        deleteStudent,
        assignSubject,
        addProject,
        addInternalMark,
        addAssignment,
        addCertificate,
        updateRemarks,
        updateLabPerformance,
        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => useContext(StudentContext);
