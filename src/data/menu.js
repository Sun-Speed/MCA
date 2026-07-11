import { 
  LayoutDashboard, 
  Users, 
  FlaskConical, 
  UserCog, 
  BarChart3, 
  ClipboardCheck, 
  History, 
  FolderKanban, 
  FileText 
} from "lucide-react";

export const hodMenu = [
  { label: "Dashboard", path: "/hod", icon: LayoutDashboard },
  { label: "Teachers", path: "/hod/teachers", icon: Users },
  { label: "Labs", path: "/hod/labs", icon: FlaskConical },
  { label: "Clerks", path: "/hod/clerks", icon: UserCog },
  { label: "Reports", path: "/hod/reports", icon: BarChart3 },
];

export const clerkMenu = [
  { label: "Dashboard", path: "/clerk", icon: LayoutDashboard },
  { label: "Students", path: "/clerk/students", icon: Users },
  {
    label: "Student Lab Assignment",
    path: "/clerk/student-labs",
    icon: FlaskConical,
  },
  { label: "Activities", path: "/clerk/activities", icon: BarChart3 },
];

export const teacherMenu = [
  { label: "Dashboard", path: "/teacher", icon: LayoutDashboard },
  {
    label: "Attendance",
    path: "/teacher/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Sessions History",
    path: "/teacher/sessions",
    icon: History,
  },
  { label: "Students", path: "/teacher/students", icon: Users },
  {
    label: "Projects",
    path: "/teacher/projects",
    icon: FolderKanban,
  },
  {
    label: "Assignments",
    path: "/teacher/assignments",
    icon: FileText,
  },
];