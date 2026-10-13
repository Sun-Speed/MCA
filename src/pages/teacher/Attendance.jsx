// import { useNavigate } from "react-router-dom";

// import DashboardLayout from "../../components/layout/DashboardLayout";
// import { useLabSession } from "../../context/LabSessionContext";

// const Attendance = () => {
//   const navigate = useNavigate();

//   const { activeSession, markAttendance, endSession } = useLabSession();

//   const finishSession = () => {
//     console.log("Ending Session:", activeSession.id);

//     endSession(activeSession.id);

//     alert("Lab Session Completed");

//     navigate("/teacher");
//   };

//   return (
//     <DashboardLayout title="Attendance">
//       {!activeSession ? (
//         <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50 transition-all hover:border-indigo-200">
//           {/* Minimalistic Icon Graphic */}
//           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
//             <svg
//               className="w-8 h-8 text-indigo-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//               />
//             </svg>
//           </div>

//           <h2 className="text-xl font-black text-gray-900 tracking-tight">
//             No Active Session
//           </h2>
//           <p className="mt-2 text-sm text-gray-400 font-medium max-w-xs text-center leading-relaxed">
//             Your workspace is currently empty. Initiate a new lab session to get
//             started.
//           </p>

//           {/* Call-to-Action Button */}
//           <button
//             onClick={() => navigate("/teacher")}
//             className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Session Header Card */}
//           <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl mb-8">
//             {/* Ambient background glow */}
//             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none" />

//             <div className="relative z-10 flex flex-col gap-8">
//               {/* Top Row: Title & Action */}
//               <div className="flex flex-wrap justify-between items-start gap-6">
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
//                       <span className="relative flex h-2 w-2">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                       </span>
//                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
//                         Live Session
//                       </span>
//                     </div>
//                     <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
//                       {activeSession.startTime}
//                     </span>
//                   </div>

//                   <h1 className="text-5xl font-black tracking-tight">
//                     {activeSession.lab.labName}
//                   </h1>
//                   <p className="text-indigo-300 font-bold tracking-widest uppercase text-xs mt-2 opacity-80">
//                     {activeSession.department} • Semester{" "}
//                     {activeSession.semester} • Section {activeSession.section}
//                   </p>
//                 </div>

//                 <button
//                   onClick={finishSession}
//                   className="group relative bg-white text-gray-900 font-black px-8 py-4 rounded-3xl transition-all hover:scale-[1.02] hover:bg-rose-500 hover:text-white"
//                 >
//                   <span className="relative z-10 uppercase tracking-widest text-xs">
//                     End Lab Session
//                   </span>
//                 </button>
//               </div>

//               {/* Metric Row: The "Quick Glance" Data */}
//               <div className="flex items-center gap-6 pt-6 border-t border-white/10">
//                 {[
//                   { label: "Total", val: activeSession.students.length },
//                   {
//                     label: "Present",
//                     val: activeSession.students.filter(
//                       (s) => s.attendance === "PRESENT",
//                     ).length,
//                   },
//                   {
//                     label: "Absent",
//                     val: activeSession.students.filter(
//                       (s) => s.attendance === "ABSENT",
//                     ).length,
//                   },
//                   {
//                     label: "Late",
//                     val: activeSession.students.filter(
//                       (s) => s.attendance === "LATE",
//                     ).length,
//                   },
//                 ].map((stat, i) => (
//                   <div key={i} className="flex flex-col">
//                     <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">
//                       {stat.label}
//                     </span>
//                     <span className="text-2xl font-black">{stat.val}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Student List Section */}
//           <h2 className="text-2xl font-black text-gray-900 mb-6 px-1">
//             Live Class List{" "}
//             <span className="opacity-40">
//               ({activeSession.students.length})
//             </span>
//           </h2>

//           <div className="grid gap-4">
//             {activeSession.students.map((student) => (
//               <div
//                 key={student.studentId}
//                 className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-indigo-100 transition-all"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-500">
//                     {student.name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3 className="font-black text-gray-900">{student.name}</h3>
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                       {student.rollNumber}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Attendance Status Badge */}
//                 <div className="flex items-center gap-6">
//                   <div className="text-right hidden md:block">
//                     <p className="text-[9px] font-black uppercase text-gray-400">
//                       Entry/Exit
//                     </p>
//                     <p className="text-xs font-bold text-gray-600">
//                       {student.entryTime || "--"} / {student.exitTime || "--"}
//                     </p>
//                   </div>

//                   {/* Attendance Controls */}
//                   <div className="flex gap-2">
//                     <button
//                       className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${student.attendance === "PRESENT" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-emerald-100"}`}
//                       onClick={() =>
//                         markAttendance(
//                           activeSession.id,
//                           student.studentId,
//                           "PRESENT",
//                         )
//                       }
//                     >
//                       Present
//                     </button>
//                     <button
//                       className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${student.attendance === "ABSENT" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-rose-100"}`}
//                       onClick={() =>
//                         markAttendance(
//                           activeSession.id,
//                           student.studentId,
//                           "ABSENT",
//                         )
//                       }
//                     >
//                       Absent
//                     </button>
//                     <button
//                       className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${student.attendance === "LATE" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-amber-100"}`}
//                       onClick={() =>
//                         markAttendance(
//                           activeSession.id,
//                           student.studentId,
//                           "LATE",
//                         )
//                       }
//                     >
//                       Late
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </DashboardLayout>
//   );
// };

// export default Attendance;
























// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import DashboardLayout from "../../components/layout/DashboardLayout";
// import { useLabSession } from "../../context/LabSessionContext";

// const Attendance = () => {
//   const navigate = useNavigate();

//   const { activeSession, markAttendance, endSession } = useLabSession();

//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   const [cameraError, setCameraError] = useState("");
//   const [cameraActive, setCameraActive] = useState(false);
//   const [capturedFrame, setCapturedFrame] = useState("");
//   const [cameraMessage, setCameraMessage] = useState("");

//   // Open the camera only when the teacher requests it.
//   const startCamera = async () => {
//     setCameraError("");
//     setCameraMessage("");
//     setCapturedFrame("");

//     if (!navigator.mediaDevices?.getUserMedia) {
//       setCameraError(
//         "Camera access is unavailable. Use localhost or HTTPS and a supported browser.",
//       );
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "user",
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//         audio: false,
//       });

//       streamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//       }

//       setCameraActive(true);
//       setCameraMessage(
//         "Camera ready. Python face recognition will be connected next.",
//       );
//     } catch (error) {
//       console.error("Unable to start camera:", error);

//       setCameraError(
//         "Could not access the camera. Please allow camera permission and check that another application is not using it.",
//       );
//     }
//   };

//   // Stop the webcam and release the camera hardware.
//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }

//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }

//     setCameraActive(false);
//     setCapturedFrame("");
//     setCameraMessage("Camera stopped.");
//   };

//   // Capture one frame for frontend testing.
//   // This does not perform face recognition yet.
//   const captureFrame = () => {
//     const video = videoRef.current;

//     if (!video || !video.videoWidth || !video.videoHeight) {
//       setCameraError("Wait for the live camera preview to load.");
//       return;
//     }

//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext("2d");

//     if (!context) {
//       setCameraError("Unable to capture a camera frame.");
//       return;
//     }

//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const imageData = canvas.toDataURL("image/jpeg", 0.85);

//     setCapturedFrame(imageData);
//     setCameraError("");
//     setCameraMessage(
//       "Frame captured successfully. It has not been sent to Python or used to mark attendance.",
//     );
//   };

//   // Release camera resources when leaving this page.
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // Stop the camera if the active session ends.
//   useEffect(() => {
//     if (!activeSession) {
//       stopCamera();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeSession]);

//   const finishSession = () => {
//     if (!activeSession) return;

//     const confirmed = window.confirm(
//       "Are you sure you want to end this lab session?",
//     );

//     if (!confirmed) return;

//     stopCamera();
//     endSession(activeSession.id);

//     alert("Lab session completed.");
//     navigate("/teacher");
//   };

//   return (
//     <DashboardLayout title="Attendance">
//       {!activeSession ? (
//         <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
//           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
//             <svg
//               className="w-8 h-8 text-indigo-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//               />
//             </svg>
//           </div>

//           <h2 className="text-xl font-black text-gray-900">
//             No Active Session
//           </h2>

//           <p className="mt-2 text-sm text-gray-400 text-center max-w-xs">
//             Start an assigned lab from your teacher dashboard to access
//             attendance and the lab camera.
//           </p>

//           <button
//             onClick={() => navigate("/teacher")}
//             className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* ACTIVE SESSION HEADER */}
//           <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl mb-8">
//             <div className="relative z-10 flex flex-col gap-8">
//               <div className="flex flex-wrap justify-between items-start gap-6">
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <span className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
//                       Active Lab
//                     </span>

//                     <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
//                       {activeSession.startTime}
//                     </span>
//                   </div>

//                   <h1 className="text-4xl md:text-5xl font-black tracking-tight">
//                     {activeSession.lab?.labName || "Active Lab"}
//                   </h1>

//                   <p className="text-indigo-300 font-bold tracking-widest uppercase text-xs mt-2">
//                     {activeSession.department} • Semester{" "}
//                     {activeSession.semester} • Section {activeSession.section}
//                   </p>
//                 </div>

//                 <button
//                   onClick={finishSession}
//                   className="bg-white text-gray-900 font-black px-8 py-4 rounded-3xl hover:bg-rose-500 hover:text-white transition-all"
//                 >
//                   <span className="uppercase tracking-widest text-xs">
//                     End Lab Session
//                   </span>
//                 </button>
//               </div>

//               <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/10">
//                 {[
//                   {
//                     label: "Total",
//                     val: activeSession.students.length,
//                   },
//                   {
//                     label: "Present",
//                     val: activeSession.students.filter(
//                       (s) => s.attendance === "PRESENT",
//                     ).length,
//                   },
//                   {
//                     label: "Absent",
//                     val: activeSession.students.filter(
//                       (s) => s.attendance === "ABSENT",
//                     ).length,
//                   },
//                   {
//                     label: "Late",
//                     val: activeSession.students.filter(
//                       (s) => s.attendance === "LATE",
//                     ).length,
//                   },
//                 ].map((stat) => (
//                   <div key={stat.label}>
//                     <span className="block text-[9px] font-black uppercase text-white/40 tracking-widest">
//                       {stat.label}
//                     </span>
//                     <span className="text-2xl font-black">{stat.val}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* TEACHER AI CAMERA */}
//           <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm mb-10">
//             <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl font-black text-gray-900">
//                   AI Camera Attendance
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Use the teacher's computer camera for this active lab.
//                 </p>
//               </div>

//               <span
//                 className={`px-3 py-2 rounded-full text-xs font-bold ${
//                   cameraActive
//                     ? "bg-emerald-100 text-emerald-700"
//                     : "bg-gray-100 text-gray-600"
//                 }`}
//               >
//                 {cameraActive ? "Camera Active" : "Camera Stopped"}
//               </span>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* LIVE CAMERA */}
//               <div className="bg-gray-950 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   muted
//                   className={`w-full h-full object-cover ${
//                     cameraActive ? "" : "hidden"
//                   }`}
//                 />

//                 {!cameraActive && (
//                   <div className="text-center text-white/60 p-6">
//                     <div className="text-5xl mb-4">📷</div>
//                     <p className="font-bold">Camera is not running</p>
//                     <p className="text-xs mt-2">
//                       Start the camera after beginning the lab session.
//                     </p>
//                   </div>
//                 )}

//                 {cameraActive && (
//                   <span className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-2 rounded-full">
//                     Live Preview
//                   </span>
//                 )}
//               </div>

//               {/* CAPTURED FRAME */}
//               <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
//                 {capturedFrame ? (
//                   <img
//                     src={capturedFrame}
//                     alt="Captured camera frame"
//                     className="w-full h-full object-contain"
//                   />
//                 ) : (
//                   <div className="text-center text-gray-400 p-6">
//                     <p className="font-bold">No frame captured</p>
//                     <p className="text-xs mt-2">
//                       Capture a frame to test the camera preview.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-3 mt-6">
//               {!cameraActive ? (
//                 <button
//                   type="button"
//                   onClick={startCamera}
//                   className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
//                 >
//                   Start AI Camera
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     onClick={captureFrame}
//                     className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
//                   >
//                     Capture Frame
//                   </button>

//                   <button
//                     type="button"
//                     onClick={stopCamera}
//                     className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200"
//                   >
//                     Stop Camera
//                   </button>
//                 </>
//               )}
//             </div>

//             {cameraError && (
//               <p role="alert" className="text-sm text-red-600 mt-4">
//                 {cameraError}
//               </p>
//             )}

//             {cameraMessage && (
//               <p aria-live="polite" className="text-sm text-gray-600 mt-4">
//                 {cameraMessage}
//               </p>
//             )}

//             <p className="text-xs text-gray-400 mt-4">
//               Camera preview and frame capture are implemented. Actual face
//               recognition and automatic attendance will be connected to the
//               Python backend in the next step.
//             </p>
//           </div>

//           {/* STUDENT ATTENDANCE LIST */}
//           <h2 className="text-2xl font-black text-gray-900 mb-6 px-1">
//             Live Class List{" "}
//             <span className="opacity-40">
//               ({activeSession.students.length})
//             </span>
//           </h2>

//           <div className="grid gap-4">
//             {activeSession.students.map((student) => (
//               <div
//                 key={student.studentId}
//                 className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-indigo-100 transition-all"
//               >
//                 <div className="flex items-center gap-4">
//                   {student.photo ? (
//                     <img
//                       src={student.photo}
//                       alt={student.name}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-500">
//                       {student.name?.charAt(0) || "S"}
//                     </div>
//                   )}

//                   <div>
//                     <h3 className="font-black text-gray-900">{student.name}</h3>
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                       {student.rollNumber}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-4">
//                   <div className="text-left md:text-right">
//                     <p className="text-[9px] font-black uppercase text-gray-400">
//                       Entry / Exit
//                     </p>
//                     <p className="text-xs font-bold text-gray-600">
//                       {student.entryTime || "--"} / {student.exitTime || "--"}
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     {[
//                       {
//                         label: "Present",
//                         status: "PRESENT",
//                         style:
//                           student.attendance === "PRESENT"
//                             ? "bg-emerald-600 text-white"
//                             : "bg-gray-100 text-gray-600 hover:bg-emerald-100",
//                       },
//                       {
//                         label: "Absent",
//                         status: "ABSENT",
//                         style:
//                           student.attendance === "ABSENT"
//                             ? "bg-rose-600 text-white"
//                             : "bg-gray-100 text-gray-600 hover:bg-rose-100",
//                       },
//                       {
//                         label: "Late",
//                         status: "LATE",
//                         style:
//                           student.attendance === "LATE"
//                             ? "bg-amber-500 text-white"
//                             : "bg-gray-100 text-gray-600 hover:bg-amber-100",
//                       },
//                     ].map((option) => (
//                       <button
//                         key={option.status}
//                         type="button"
//                         className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${option.style}`}
//                         onClick={() =>
//                           markAttendance(
//                             activeSession.id,
//                             student.studentId,
//                             option.status,
//                           )
//                         }
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </DashboardLayout>
//   );
// };

// export default Attendance;


















import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLabSession } from "../../context/LabSessionContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

const RECOGNITION_INTERVAL = 4000;
const REQUIRED_MATCHES = 2;

const Attendance = () => {
  const navigate = useNavigate();

  const { activeSession, markAttendance, endSession } = useLabSession();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionInFlightRef = useRef(false);
  const lastMatchRef = useRef({ studentId: null, count: 0 });

  const [cameraError, setCameraError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedFrame, setCapturedFrame] = useState("");
  const [cameraMessage, setCameraMessage] = useState("");
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [recognitionBusy, setRecognitionBusy] = useState(false);
  const [attendanceBusy, setAttendanceBusy] = useState(false);

  const sessionId = activeSession?.id;

  const stopCamera = useCallback((showMessage = true) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setRecognitionBusy(false);
    setRecognitionResult(null);
    setCapturedFrame("");
    recognitionInFlightRef.current = false;
    lastMatchRef.current = { studentId: null, count: 0 };

    if (showMessage) {
      setCameraMessage("Camera stopped.");
    }
  }, []);

  const startCamera = async () => {
    setCameraError("");
    setCameraMessage("");
    setRecognitionResult(null);
    setCapturedFrame("");
    lastMatchRef.current = { studentId: null, count: 0 };

    if (!sessionId) {
      setCameraError("Start a lab session before opening the camera.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access requires localhost or HTTPS and a supported browser."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setCameraActive(true);
      setCameraMessage(
        "Camera ready. Looking for enrolled students in this lab session."
      );
    } catch (error) {
      console.error("Unable to start camera:", error);

      setCameraError(
        "Could not access the camera. Allow camera permission and close other apps using it."
      );
    }
  };

  const captureCurrentFrame = useCallback(() => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      return null;
    }

    // Reduce image dimensions to keep requests manageable.
    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / video.videoWidth);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.75);
  }, []);

  const recognizeFrame = useCallback(async () => {
    if (
      !cameraActive ||
      !sessionId ||
      recognitionInFlightRef.current
    ) {
      return;
    }

    const image = captureCurrentFrame();

    if (!image) {
      return;
    }

    recognitionInFlightRef.current = true;
    setRecognitionBusy(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/faces/sessions/${encodeURIComponent(sessionId)}/recognize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Face recognition request failed."
        );
      }

      if (!data.matched || !data.student) {
        lastMatchRef.current = { studentId: null, count: 0 };
        setRecognitionResult(null);
        setCameraMessage(
          data.message || "No student recognized. Keep your face visible."
        );
        return;
      }

      const student = data.student;

      // A backend match must also belong to the frontend session roster.
      const rosterStudent = activeSession?.students?.find(
        (item) =>
          String(item.studentId) === String(student.id) ||
          (
            item.usn &&
            String(item.usn).toUpperCase() ===
              String(student.usn).toUpperCase()
          )
      );

      if (!rosterStudent) {
        lastMatchRef.current = { studentId: null, count: 0 };
        setRecognitionResult(null);
        setCameraMessage(
          `${student.name} was recognized, but is not in this session's student list. Attendance was not changed.`
        );
        return;
      }

      const matchedId = String(rosterStudent.studentId);

      if (lastMatchRef.current.studentId === matchedId) {
        lastMatchRef.current.count += 1;
      } else {
        lastMatchRef.current = {
          studentId: matchedId,
          count: 1,
        };
      }

      const confirmed =
        lastMatchRef.current.count >= REQUIRED_MATCHES;

      setRecognitionResult({
        student: rosterStudent,
        similarity: data.similarity,
        confirmed,
      });

      setCameraMessage(
        confirmed
          ? "Consistent match detected. Review the student and confirm attendance."
          : "Possible match detected. Checking one more frame..."
      );
    } catch (error) {
      console.error("Face recognition error:", error);
      setCameraError(error.message || "Face recognition failed.");
    } finally {
      recognitionInFlightRef.current = false;
      setRecognitionBusy(false);
    }
  }, [activeSession, cameraActive, captureCurrentFrame, sessionId]);

  // Process frames sequentially so requests do not pile up.
  useEffect(() => {
    if (!cameraActive || !sessionId) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      recognizeFrame();
    }, RECOGNITION_INTERVAL);

    return () => window.clearInterval(timer);
  }, [cameraActive, sessionId, recognizeFrame]);

  // Release camera hardware when leaving this page.
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Stop camera when the session is no longer active.
  useEffect(() => {
    if (!sessionId) {
      stopCamera(false);
    }
  }, [sessionId, stopCamera]);

  const captureFrame = () => {
    const image = captureCurrentFrame();

    if (!image) {
      setCameraError("Wait for the camera preview to load.");
      return;
    }

    setCapturedFrame(image);
    setCameraError("");
    setCameraMessage("Frame captured for preview.");
  };

  const confirmAttendance = async () => {
    if (
      !recognitionResult?.confirmed ||
      !recognitionResult.student ||
      attendanceBusy
    ) {
      return;
    }

    const student = recognitionResult.student;

    const confirmed = window.confirm(
      `Mark ${student.name} (${student.usn || student.rollNumber || student.studentId}) as PRESENT?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setAttendanceBusy(true);

      await markAttendance(
        activeSession.id,
        student.studentId,
        "PRESENT"
      );

      setCameraMessage(
        `Present status submitted for ${student.name}.`
      );

      setRecognitionResult(null);
      lastMatchRef.current = { studentId: null, count: 0 };
    } catch (error) {
      console.error("Could not mark attendance:", error);
      setCameraError(
        error.message || "Could not mark attendance. Please try again."
      );
    } finally {
      setAttendanceBusy(false);
    }
  };

  const finishSession = () => {
    if (!activeSession) {
      return;
    }

    if (!window.confirm("Are you sure you want to end this lab session?")) {
      return;
    }

    stopCamera(false);
    endSession(activeSession.id);
    navigate("/teacher");
  };

  return (
    <DashboardLayout title="Attendance">
      {!activeSession ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-16">
          <div className="mb-6 text-5xl">📷</div>
          <h2 className="text-xl font-black text-gray-900">
            No Active Session
          </h2>
          <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
            Start an assigned lab from your teacher dashboard to access
            attendance and the lab camera.
          </p>
          <button
            type="button"
            onClick={() => navigate("/teacher")}
            className="mt-8 rounded-xl bg-gray-900 px-8 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-600"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8 rounded-3xl bg-gray-900 p-6 text-white shadow-xl md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase text-emerald-400">
                  Active Lab
                </span>

                <p className="mt-4 text-sm text-white/60">
                  {activeSession.startTime}
                </p>

                <h1 className="mt-2 text-3xl font-black md:text-5xl">
                  {activeSession.lab?.labName || "Active Lab"}
                </h1>

                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-indigo-300">
                  {activeSession.department} · Semester{" "}
                  {activeSession.semester} · Section {activeSession.section}
                </p>
              </div>

              <button
                type="button"
                onClick={finishSession}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-900 hover:bg-rose-500 hover:text-white"
              >
                End Lab Session
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-6">
              {[
                {
                  label: "Total",
                  value: activeSession.students.length,
                },
                {
                  label: "Present",
                  value: activeSession.students.filter(
                    (student) => student.attendance === "PRESENT"
                  ).length,
                },
                {
                  label: "Absent",
                  value: activeSession.students.filter(
                    (student) => student.attendance === "ABSENT"
                  ).length,
                },
                {
                  label: "Late",
                  value: activeSession.students.filter(
                    (student) => student.attendance === "LATE"
                  ).length,
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="block text-xs uppercase text-white/50">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-black">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <section className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  AI Camera Attendance
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Face recognition checks enrolled students in the active lab.
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-2 text-xs font-bold ${
                  cameraActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {cameraActive ? "Camera Active" : "Camera Stopped"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-950">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${
                    cameraActive ? "" : "hidden"
                  }`}
                />

                {!cameraActive && (
                  <div className="p-6 text-center text-white/60">
                    <div className="mb-4 text-5xl">📷</div>
                    <p className="font-bold">Camera is not running</p>
                    <p className="mt-2 text-xs">
                      Start the camera after beginning the lab session.
                    </p>
                  </div>
                )}

                {cameraActive && (
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-2 text-xs text-white">
                    Live Preview
                  </span>
                )}
              </div>

              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                {capturedFrame ? (
                  <img
                    src={capturedFrame}
                    alt="Captured camera frame"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    <p className="font-bold">No frame captured</p>
                    <p className="mt-2 text-xs">
                      Use Capture Frame to preview a camera image.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Start AI Camera
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={captureFrame}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    Capture Frame
                  </button>

                  <button
                    type="button"
                    onClick={() => stopCamera()}
                    className="rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200"
                  >
                    Stop Camera
                  </button>
                </>
              )}
            </div>

            {recognitionBusy && (
              <p className="mt-4 text-sm text-indigo-600" aria-live="polite">
                <span className="mr-2 inline-block animate-spin">⟳</span>
                Checking camera frame...
              </p>
            )}

            {cameraError && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {cameraError}
              </p>
            )}

            {cameraMessage && (
              <p aria-live="polite" className="mt-4 text-sm text-gray-600">
                {cameraMessage}
              </p>
            )}

            {recognitionResult && (
              <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  {recognitionResult.confirmed
                    ? "Consistent match"
                    : "Possible match"}
                </p>

                <h3 className="mt-2 text-xl font-black text-gray-900">
                  {recognitionResult.student.name}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  USN: {recognitionResult.student.usn ||
                    recognitionResult.student.rollNumber ||
                    "Not available"}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Similarity:{" "}
                  {typeof recognitionResult.similarity === "number"
                    ? `${(recognitionResult.similarity * 100).toFixed(1)}%`
                    : "Not provided"}
                </p>

                {recognitionResult.confirmed ? (
                  <button
                    type="button"
                    disabled={attendanceBusy}
                    onClick={confirmAttendance}
                    className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {attendanceBusy
                      ? "Saving..."
                      : "Confirm and Mark Present"}
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-indigo-700">
                    Waiting for another consistent recognition before
                    enabling attendance confirmation.
                  </p>
                )}
              </div>
            )}

            <p className="mt-4 text-xs text-gray-400">
              Recognition runs approximately every four seconds while the
              camera is active. Review the match before confirming attendance.
            </p>
          </section>

          <h2 className="mb-6 px-1 text-2xl font-black text-gray-900">
            Live Class List ({activeSession.students.length})
          </h2>

          <div className="grid gap-4">
            {activeSession.students.map((student) => (
              <div
                key={student.studentId}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-100 md:flex-row md:items-center"
              >
                <div className="flex items-center gap-4">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 font-black text-gray-500">
                      {student.name?.charAt(0) || "S"}
                    </div>
                  )}

                  <div>
                    <h3 className="font-black text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {student.rollNumber}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-black uppercase text-gray-400">
                      Entry / Exit
                    </p>
                    <p className="text-xs font-bold text-gray-600">
                      {student.entryTime || "--"} / {student.exitTime || "--"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: "Present",
                        status: "PRESENT",
                        active: "bg-emerald-600 text-white",
                        idle: "bg-gray-100 text-gray-600 hover:bg-emerald-100",
                      },
                      {
                        label: "Absent",
                        status: "ABSENT",
                        active: "bg-rose-600 text-white",
                        idle: "bg-gray-100 text-gray-600 hover:bg-rose-100",
                      },
                      {
                        label: "Late",
                        status: "LATE",
                        active: "bg-amber-500 text-white",
                        idle: "bg-gray-100 text-gray-600 hover:bg-amber-100",
                      },
                    ].map((option) => (
                      <button
                        key={option.status}
                        type="button"
                        onClick={() =>
                          markAttendance(
                            activeSession.id,
                            student.studentId,
                            option.status
                          )
                        }
                        className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                          student.attendance === option.status
                            ? option.active
                            : option.idle
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Attendance;