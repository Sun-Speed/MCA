import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FlaskConical,
  BarChart3,
  Settings,
} from "lucide-react";

const Sidebar = ({ menu }) => {
  return (
    <aside className="w-64 border-r border-gray-100 min-h-screen p-6 bg-white">
      {/* Brand Section */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <FlaskConical className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          Smart Lab
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2">
        {menu.map((item) => {
  const IconComponent = item.icon;
  
  return (
    <NavLink
      key={item.path}
      to={item.path}
      // ADD THIS PROP:
      end={item.path.split('/').length <= 2} 
      // Change these classes in your NavLink:
className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-black text-xs uppercase tracking-widest ${
    isActive
      ? "bg-gray-900 text-white shadow-lg shadow-gray-200" // Updated to Slate/Black
      : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
  }`
}
    >
      <IconComponent size={20} />
      {item.label}
    </NavLink>
  );
})}
      </div>
    </aside>
  );
};

export default Sidebar;
