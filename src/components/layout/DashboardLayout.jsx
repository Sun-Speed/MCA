// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import { hodMenu, clerkMenu, teacherMenu } from "../../data/menu";

// const DashboardLayout = ({ title, children }) => {
//   // const { logout } = useAuth();
//   const navigate = useNavigate();

//   const { currentUser, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   let menu = [];

// switch (currentUser?.role) {
//   case "hod":
//     menu = hodMenu;
//     break;

//   case "teacher":
//     menu = teacherMenu;
//     break;

//   case "clerk":
//     menu = clerkMenu;
//     break;

//   default:
//     menu = [];
// }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar menu={menu} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <Header title={title} />

//         <main className="flex-1 p-6">
//           {children}
//         </main>

//         <div className="border-t p-4">
//           <button
//             onClick={handleLogout}
//             className="border px-4 py-2 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;






import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react"; // Import icon
import Sidebar from "./Sidebar";
import Header from "./Header";
import { hodMenu, clerkMenu, teacherMenu } from "../../data/menu";

const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  let menu = [];
  switch (currentUser?.role) {
    case "hod": menu = hodMenu; break;
    case "teacher": menu = teacherMenu; break;
    case "clerk": menu = clerkMenu; break;
    default: menu = [];
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar - Now includes the Logout at the bottom */}
      <div className="flex flex-col border-r border-gray-100 bg-white w-64">
        <div className="flex-1">
          <Sidebar menu={menu} />
        </div>
        
        {/* Modernized Logout Action */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} currentUser={currentUser} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;