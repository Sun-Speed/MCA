import { useAuth } from "../../context/AuthContext";
import { User, LogOut, Bell } from "lucide-react";

const Header = ({ title }) => {
  const { currentUser } = useAuth();

  return (
    // <header className="border-b p-5 flex justify-between">

    //   <div>

    //     <h1 className="text-3xl font-bold">
    //       {title}
    //     </h1>

    //     <p>{currentUser?.role}</p>

    //   </div>

    //   <div className="text-right">

    //     <h2 className="font-bold">
    //       {currentUser?.name}
    //     </h2>

    //     <p>{currentUser?.email}</p>

    //   </div>

    // </header>



    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-6 flex justify-between items-center transition-all">
  {/* Left: Page Title */}
  <div>
    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
      {title}
    </h1>
    <div className="flex items-center gap-2 mt-1">
      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
      <span className="text-sm font-medium text-indigo-600 capitalize">
        {currentUser?.role || "System Admin"}
      </span>
    </div>
  </div>

  {/* Right: User Profile & Controls */}
  <div className="flex items-center gap-6">
    {/* Notification Bell (Optional) */}
    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
      <Bell size={20} />
    </button>

    <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
      <div className="text-right hidden md:block">
        <h2 className="font-bold text-gray-900 text-sm">{currentUser?.name}</h2>
        <p className="text-xs text-gray-500">{currentUser?.email}</p>
      </div>
      
      {/* Avatar Placeholder */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 font-bold">
        {currentUser?.name?.charAt(0) || "U"}
      </div>
    </div>
  </div>
</header>
  );
};

export default Header;