import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/Logo_Welddefectspecimen.svg";
import axios from "axios";
import swal from "sweetalert2";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "", 
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone, 
      };

      await axios.post("http://localhost:5000/auth/register", payload);

      await swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ!",
        text: "บัญชีของคุณพร้อมใช้งานแล้ว",
        confirmButtonColor: "#0F172A",
      });

      navigate("/login");
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน";
      setError(message);

      swal.fire({
        icon: "error",
        title: "ลงทะเบียนล้มเหลว",
        text: message,
        confirmButtonColor: "#0F172A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-[#0F172A] opacity-5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-[#FF85A2] opacity-10 rounded-full blur-[80px]"></div>

      <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-white relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-40 h-auto mb-4" />
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">สร้างบัญชีผู้ใช้งาน</h2>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em]">Join our professional community</p>
        </div>

        <form className="space-y-5" onSubmit={handleSignup}>
          {error && (
            <div className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100 uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="ชื่อ" />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="นามสกุล" />
          </div>

          <InputField label="Phone Number" name="phone" type="phone" value={formData.phone} onChange={handleChange} placeholder="08x-xxx-xxxx" />
          <InputField label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="ตั้งชื่อผู้ใช้งาน" />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••" />
            <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#FF85A2]"
              }`}
            >
              {loading ? "กำลังลงทะเบียน..." : "Confirm Registration"}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-400 font-medium">
              มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
              <Link to="/login" className="text-[#FF85A2] hover:text-[#0F172A] font-bold transition-colors ml-1">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Sub-components ---
interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

function InputField({ label, name, type = "text", value, onChange, placeholder }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#FF85A2] focus:ring-4 focus:ring-pink-50 outline-none transition-all placeholder:text-slate-300 text-sm text-[#0F172A]"
      />
    </div>
  );
}