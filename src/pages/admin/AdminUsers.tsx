import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  LayoutDashboard, 
  CreditCard, 
  Package, 
  Users, 
  LogOut, 
  UserPlus, 
  Trash2,
  ShieldCheck,
  Search
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "customer";
  status: "active" | "suspended";
  joinDate: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);

      const formattedUsers: User[] = response.data.map((item: any) => ({
        id: item.id.toString(),
        name:
          item.firstName || item.lastName
            ? `${item.firstName || ""} ${item.lastName || ""}`.trim()
            : item.username,
        email: item.email || "-", // เพิ่ม fallback สำหรับ email
        role: item.role,
        status: item.isActive === 1 ? "active" : "suspended",
        joinDate: new Date(item.createdAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));
      setUsers(formattedUsers);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401)
        navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleRegister = async () => {
    if (!formData.username || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอก Username และ Password ให้ครบถ้วน",
        confirmButtonColor: "#0F172A",
      });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.post("http://localhost:5000/auth/register-seller", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "เพิ่มเจ้าหน้าที่เรียบร้อยแล้ว",
        confirmButtonColor: "#0F172A",
        timer: 2000,
      });
      fetchUsers();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถเพิ่มเจ้าหน้าที่ได้",
        confirmButtonColor: "#FF85A2",
      });
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบผู้ใช้งาน: ${name} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "ลบผู้ใช้งาน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://localhost:5000/users/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire("สำเร็จ!", "ลบผู้ใช้งานเรียบร้อยแล้ว", "success");
        fetchUsers();
      } catch (err: any) {
        Swal.fire(
          "ผิดพลาด!",
          err.response?.data?.message || "ไม่สามารถลบผู้ใช้งานได้",
          "error",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-2xl z-20">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter italic uppercase">
            WELD<span className="text-[#FF85A2]">ADMIN</span>
          </h1>
          <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black mt-1">
            System Authority
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarItem label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon={<CreditCard size={18} />} onClick={() => navigate("/adminverification")} />
          <SidebarItem label="อนุมัติสินค้า" icon={<Package size={18} />} onClick={() => navigate("/adminproductapproval")} />
          <SidebarItem label="รายชื่อผู้ใช้" icon={<Users size={18} />} active onClick={() => navigate("/adminusers")} />
        </nav>
        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition-all text-xs font-black uppercase tracking-widest w-full p-2"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-[#FF85A2]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Permissions management</span>
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] italic uppercase tracking-tighter">
              User Management
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0F172A] text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#FF85A2] transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <UserPlus size={16} /> เพิ่มเจ้าหน้าที่
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black">
                  <th className="px-8 py-6">ข้อมูลผู้ใช้งาน</th>
                  <th className="px-8 py-6">ระดับสิทธิ์</th>
                  <th className="px-8 py-6">วันที่เข้าร่วม</th>
                  <th className="px-8 py-6">สถานะ</th>
                  <th className="px-8 py-6 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#FF85A2] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">กำลังโหลดข้อมูล...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs uppercase border border-slate-200">
                            {user.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-black text-sm tracking-tight">{user.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                          user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                          user.role === 'seller' ? 'bg-sky-50 text-sky-600 border-sky-100' : 
                          'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{user.joinDate}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            user.status === "active" 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-rose-50 text-rose-600 border-rose-100" 
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                          title="ลบผู้ใช้งาน"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal - Modern Transparent Design */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg border border-white relative z-10 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF85A2] mb-4">
                    <UserPlus size={28} />
                </div>
                <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase italic">เพิ่มเจ้าหน้าที่ใหม่</h2>
                <p className="text-slate-400 text-[9px] mt-1 uppercase tracking-[0.2em] font-black">Authorized Personnel Only</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ</label>
                    <input required placeholder="First Name" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-[#FF85A2] focus:bg-white outline-none transition text-sm font-bold"
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">นามสกุล</label>
                    <input required placeholder="Last Name" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-[#FF85A2] focus:bg-white outline-none transition text-sm font-bold"
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">เบอร์โทรศัพท์</label>
                  <input placeholder="08x-xxx-xxxx" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-[#FF85A2] focus:bg-white outline-none transition text-sm font-bold"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <input required placeholder="ตั้งชื่อผู้ใช้งาน" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-[#FF85A2] focus:bg-white outline-none transition text-sm font-bold"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <input required type="password" placeholder="••••••••" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:ring-2 focus:ring-[#FF85A2] focus:bg-white outline-none transition text-sm font-bold"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition">
                    ยกเลิก
                  </button>
                  <button type="submit" className="flex-[2] py-4 bg-[#0F172A] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg hover:bg-emerald-600 transition-all active:scale-95">
                    ยืนยันการเพิ่ม
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarItem({ label, icon, active = false, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
        active 
          ? "bg-[#FF85A2] text-white shadow-lg shadow-pink-500/20" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={`${active ? "text-white" : "text-slate-500 group-hover:text-white"} transition-colors`}>
        {icon}
      </span>
      <span className="text-sm font-black tracking-tight">{label}</span>
    </div>
  );
}