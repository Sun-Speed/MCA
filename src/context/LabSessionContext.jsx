// import { createContext, useContext, useEffect, useState } from "react";
// import labSessionService from "../services/labSessionService";

// const LabSessionContext = createContext();

// export const LabSessionProvider = ({ children }) => {
//   const [sessions, setSessions] = useState(() => {
//     return labSessionService.getAll();
//   });

//   useEffect(() => {
//     labSessionService.saveAll(sessions);
//   }, [sessions]);

//   const getCurrentTime = () => {
//   return new Date().toLocaleTimeString("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

//   const startSession = ({
//     teacher,
//     lab,
//     department,
//     semester,
//     section,
//     students,
//   }) => {

//     const alreadyRunning = sessions.find(
//   (session) => session.status === "ACTIVE"
// );

// if (alreadyRunning) {
//   alert("A lab session is already running.");
//   return alreadyRunning.id;
// }

//     const session = {
//       id: crypto.randomUUID(),

//       date: new Date().toISOString(),

//       status: "ACTIVE",

//       teacher,

//       lab,

//       department,

//       semester,

//       section,

//       startTime: getCurrentTime(),

//       endTime: null,

//       students: students.map((student) => ({
//         studentId: student.id,

//         usn: student.usn,

//         rollNumber: student.rollNumber,

//         name: student.name,

//         attendance: "ABSENT",

//         entryTime: null,

//         exitTime: null,

//         faceDetected: false,

//         qrVerified: false,

//         manualVerified: false,

//         remarks: "",

//         activities: [],
//       })),
//     };

//     setSessions((prev) => [...prev, session]);

//     return session.id;
//   };

//   const endSession = (sessionId) => {
//   const endTime = getCurrentTime();

//   setSessions((prev) =>
//     prev.map((session) => {
//       if (session.id !== sessionId) return session;

//       return {
//         ...session,

//         status: "COMPLETED",

//         endTime,

//         students: session.students.map((student) => ({
//           ...student,

//           exitTime:
//             student.attendance === "ABSENT"
//               ? null
//               : student.exitTime || endTime,
//         })),
//       };
//     }),
//   );
// };

//   const markAttendance = (sessionId, studentId, status) => {
//     updateStudentAttendance(sessionId, studentId, {
//       attendance: status,
//       entryTime: status === "ABSENT" ? null : getCurrentTime(),
//     });
//   };

//   const updateStudentAttendance = (sessionId, studentId, updates) => {
//     setSessions((prev) =>
//       prev.map((session) => {
//         if (session.id !== sessionId) return session;

//         return {
//           ...session,

//           students: session.students.map((student) =>
//             student.studentId === studentId
//               ? {
//                   ...student,
//                   ...updates,
//                 }
//               : student,
//           ),
//         };
//       }),
//     );
//   };

//   const updateStudentDetails = (
//   sessionId,
//   studentId,
//   data
// ) => {
//   setSessions((prev) =>
//     prev.map((session) => {
//       if (session.id !== sessionId) return session;

//       return {
//         ...session,

//         students: session.students.map((student) =>
//           student.studentId === studentId
//             ? {
//                 ...student,
//                 ...data,
//               }
//             : student
//         ),
//       };
//     })
//   );
// };

//   const addStudentActivity = (sessionId, studentId, activity) => {
//     setSessions((prev) =>
//       prev.map((session) => {
//         if (session.id !== sessionId) return session;

//         return {
//           ...session,

//           students: session.students.map((student) => {
//             if (student.studentId !== studentId) return student;

//             return {
//               ...student,

//               activities: [
//                 ...student.activities,

//                 {
//                   id: crypto.randomUUID(),

//                   time: getCurrentTime(),

//                   ...activity,
//                 },
//               ],
//             };
//           }),
//         };
//       }),
//     );
//   };

//   const getSession = (id) => sessions.find((session) => session.id === id);

//   const activeSession = sessions.find((session) => session.status === "ACTIVE");

//   return (
//     <LabSessionContext.Provider
//       value={{
//         sessions,
//         activeSession,
//         startSession,
//         endSession,
//         updateStudentAttendance,
//         markAttendance,
//         updateStudentDetails,
//         addStudentActivity,
//         getSession,
//       }}
//     >
//       {children}
//     </LabSessionContext.Provider>
//   );
// };

// export const useLabSession = () => useContext(LabSessionContext);









import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import labSessionService from "../services/labSessionService";
import { apiRequest } from "../services/api";

const LabSessionContext = createContext();

export const LabSessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    return labSessionService.getAll();
  });

  // Track backend session creation so attendance is not saved too early.
  const sessionSyncRef = useRef(new Map());

  useEffect(() => {
    labSessionService.saveAll(sessions);
  }, [sessions]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Synchronize a frontend-created session with Python.
  // Repeated calls for the same session reuse the same request.
  const ensureSessionSynced = (session) => {
    if (sessionSyncRef.current.has(session.id)) {
      return sessionSyncRef.current.get(session.id);
    }

    const request = apiRequest("/attendance/sessions", {
      method: "POST",
      body: JSON.stringify(session),
    }).catch((error) => {
      // Permit a future retry if the request failed.
      sessionSyncRef.current.delete(session.id);
      throw error;
    });

    sessionSyncRef.current.set(session.id, request);

    return request;
  };

  const startSession = ({
    teacher,
    lab,
    department,
    semester,
    section,
    students,
  }) => {
    const alreadyRunning = sessions.find(
      (session) => session.status === "ACTIVE",
    );

    if (alreadyRunning) {
      alert("A lab session is already running.");
      return alreadyRunning.id;
    }

    const session = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      status: "ACTIVE",
      teacher,
      lab,
      department,
      semester: String(semester),
      section: String(section),
      startTime: getCurrentTime(),

      endTime: null,

      students: students.map((student) => ({
        studentId: student.id,
        usn: student.usn,
        rollNumber: student.rollNumber,
        name: student.name,
        photo: student.photo || "",
        attendance: "ABSENT",
        entryTime: null,
        exitTime: null,
        faceDetected: false,
        qrVerified: false,
        manualVerified: false,
        remarks: "",
        activities: [],
      })),
    };

    setSessions((prev) => [...prev, session]);

    // Preserve the existing synchronous return value.
    // The backend request runs in the background.
    ensureSessionSynced(session).catch((error) => {
      console.error("Unable to synchronize lab session:", error);
      alert(
        "The lab session started locally, but the backend could not save it. Check the backend and try marking attendance again.",
      );
    });

    return session.id;
  };

  const endSession = (sessionId) => {
    const session = sessions.find(
      (item) => item.id === sessionId,
    );

    if (!session) return;

    const endTime = getCurrentTime();

    setSessions((prev) =>
      prev.map((item) => {
        if (item.id !== sessionId) return item;

        return {
          ...item,
          status: "COMPLETED",
          endTime,
          students: item.students.map((student) => ({
            ...student,
            exitTime:
              student.attendance === "ABSENT"
                ? null
                : student.exitTime || endTime,
          })),
        };
      }),
    );

    // Save session completion to the backend.
    ensureSessionSynced(session)
      .then(() =>
        apiRequest(`/attendance/sessions/${sessionId}/end`, {
          method: "PATCH",
        }),
      )
      .catch((error) => {
        console.error("Unable to end backend session:", error);
        alert(
          "The session was ended locally, but the backend could not update it. Please check the backend.",
        );
      });
  };

  const updateStudentAttendance = (
    sessionId,
    studentId,
    updates,
  ) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          students: session.students.map((student) =>
            student.studentId === studentId
              ? { ...student, ...updates }
              : student,
          ),
        };
      }),
    );
  };

  const markAttendance = (sessionId, studentId, status) => {
    const session = sessions.find(
      (item) => item.id === sessionId,
    );

    const student = session?.students.find(
      (item) => item.studentId === studentId,
    );

    if (!session || !student) return;

    const entryTime =
      status === "ABSENT"
        ? null
        : student.entryTime || getCurrentTime();

    const exitTime =
      status === "ABSENT" ? null : student.exitTime;

    const updates = {
      attendance: status,
      entryTime,
      exitTime,
      manualVerified: true,
    };

    // Update the interface immediately.
    updateStudentAttendance(sessionId, studentId, updates);

    // Persist the attendance record in Python/SQLite.
    ensureSessionSynced(session)
      .then(() =>
        apiRequest(
          `/attendance/sessions/${sessionId}/records`,
          {
            method: "POST",
            body: JSON.stringify({
              studentId,
              status,
              entryTime,
              exitTime,
              verificationMode: "MANUAL",
            }),
          },
        ),
      )
      .catch((error) => {
        console.error("Unable to save attendance:", error);
        alert(
          "Attendance changed on the screen but could not be saved to the backend. Please check the backend and try again.",
        );
      });
  };

  const updateStudentDetails = (
    sessionId,
    studentId,
    data,
  ) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          students: session.students.map((student) =>
            student.studentId === studentId
              ? { ...student, ...data }
              : student,
          ),
        };
      }),
    );
  };

  const addStudentActivity = (
    sessionId,
    studentId,
    activity,
  ) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          students: session.students.map((student) => {
            if (student.studentId !== studentId) return student;

            return {
              ...student,
              activities: [
                ...student.activities,
                {
                  id: crypto.randomUUID(),
                  time: getCurrentTime(),
                  ...activity,
                },
              ],
            };
          }),
        };
      }),
    );
  };

  const getSession = (id) =>
    sessions.find((session) => session.id === id);

  const activeSession = sessions.find(
    (session) => session.status === "ACTIVE",
  );

  return (
    <LabSessionContext.Provider
      value={{
        sessions,
        activeSession,
        startSession,
        endSession,
        updateStudentAttendance,
        markAttendance,
        updateStudentDetails,
        addStudentActivity,
        getSession,
      }}
    >
      {children}
    </LabSessionContext.Provider>
  );
};

export const useLabSession = () =>
  useContext(LabSessionContext);
