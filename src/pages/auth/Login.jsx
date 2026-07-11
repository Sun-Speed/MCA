import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login, currentUser } = useAuth();

  const [role, setRole] = useState("teacher");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loginType, setLoginType] = useState('Admin'); // 'Admin' or 'Student'

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === "hod") navigate("/hod");

    if (currentUser.role === "teacher") navigate("/teacher");

    if (currentUser.role === "clerk") navigate("/clerk");
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setError("");

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const result = login(form.email.trim(), form.password.trim(), role);

    if (!result.success) {
      setError(result.message);
      return;
    }
  };

  const fillDemo = () => {
    if (role === "hod") {
      setForm({
        email: "hod@gmail.com",
        password: "123456",
      });
    }

    if (role === "teacher") {
      setForm({
        email: "teacher@gmail.com",
        password: "123456",
      });
    }

    if (role === "clerk") {
      setForm({
        email: "clerk@gmail.com",
        password: "123456",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
  <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-xl w-full max-w-md">
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-black text-gray-900 tracking-tight">Smart Lab</h1>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Select your access portal</p>
    </div>

    {/* Toggle Tabs */}
    <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
      {['Admin', 'Student'].map((t) => (
        <button
          key={t}
          onClick={() => setLoginType(t)}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
            loginType === t ? "bg-violet-600 text-white shadow-lg" : "text-gray-500"
          }`}
        >
          {t}
        </button>
      ))}
    </div>

    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {loginType === 'Admin' ? (
        <>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm outline-none focus:border-violet-600">
            <option value="hod">Head Of Department</option>
            <option value="teacher">Teacher</option>
            <option value="clerk">Clerk</option>
          </select>
          <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm outline-none focus:border-violet-600" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
        </>
      ) : (
        <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm outline-none focus:border-violet-600" placeholder="University Seat Number (USN)" name="usn" value={form.usn} onChange={handleChange} />
      )}

      <input type="password" className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm outline-none focus:border-violet-600" placeholder="Password" name="password" value={form.password} onChange={handleChange} />

      {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>}

      <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-violet-600 transition-all shadow-lg active:scale-95">
        Login to {loginType} Portal
      </button>
    </form>
    
    {/* Demo Section */}
    <div className="mt-8 border-t pt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
      Demo → Admin: hod@gmail.com | Student: 1US21CS001
    </div>
  </div>
</div>
  );
};

export default Login;
