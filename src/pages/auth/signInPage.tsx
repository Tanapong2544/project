import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/Logo_Welddefectspecimen.svg";

export default function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      const { username, password } = credentials;
      console.log(credentials);
      
      if (username === "admin01" && password === "123456") {
        saveAuthSession(username, "Admin Strat", "admin");
        navigate("/admindashboard");
      } 
      else if (username === "seller01" && password === "123456") {
        saveAuthSession(username, "Somsak Seller", "seller");
        navigate("/sellerdashboard");
      } 
      else if (username === "user" && password === "123456") {
        saveAuthSession(username, "Somchai Jaidee", "user");
      } 
      else {
        setError("ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const saveAuthSession = (username: string, fullName: string, role: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("userName", fullName); 
    localStorage.setItem("userRole", role);
    
    // แจ้งเตือน Navbar ให้เปลี่ยนสถานะทันที (สำหรับบาง Browser ที่ Storage event ไม่ทำงานใน tab เดียวกัน)
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF85A2] opacity-[0.03] rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#0F172A] opacity-[0.03] rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(15,23,42,0.1)] p-12 border border-white relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-40 h-auto mb-4" />
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">ล็อกอินเข้าสู่ระบบ</h2>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em]">Log in to the system</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-[11px] font-black text-center bg-red-50 py-4 rounded-2xl border border-red-100 uppercase tracking-widest animate-shake">
              ⚠ {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-7 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0F172A] focus:ring-4 focus:ring-slate-50 outline-none transition-all placeholder:text-slate-300 text-[#0F172A] text-sm font-medium"
              placeholder="Username"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-7 py-4 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#0F172A] focus:ring-4 focus:ring-slate-50 outline-none transition-all placeholder:text-slate-300 text-[#0F172A] text-sm font-medium"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-2xl font-black transition-all flex justify-center items-center shadow-xl active:scale-95 uppercase tracking-[0.2em] text-[11px] ${
                isLoading 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-[#0F172A] text-white hover:bg-[#DB2777] shadow-blue-900/10"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "SIGN IN TO SYSTEM"                
              )}
            </button>
          </div>

          <div className="text-center mt-10">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              ยังไม่มีบัญชีใช่ไหม?
              <Link to="/signup" className="text-[#DB2777] hover:text-[#0F172A] ml-2 transition-colors">ลงทะเบียน</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}