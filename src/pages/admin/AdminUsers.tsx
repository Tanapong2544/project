import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  LayoutDashboard, CreditCard, Package, Users, 
  LogOut, UserPlus, Trash2, ShieldCheck, 
  Search, Menu, X, Filter, Mail, Phone
} from "lucide-react";

// --- Interfaces ---
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "", password: "", firstName: "", lastName: "", phone: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedUsers: User[] = response.data.map((item: any) => ({
        id: item.id.toString(),
        name: (item.firstName || item.lastName) 
          ? `${item.firstName || ""} ${item.lastName || ""}`.trim() 
          : item.username,
        email: item.email || item.username,
        role: item.role,
        status: item.isActive === 1 ? "active" : "suspended",
        joinDate: new Date(item.createdAt).toLocaleDateString("th-TH", {
          year: "numeric", month: "long", day: "numeric"
        }),
      }));
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [navigate]);

  useEffect(() => {
    const result = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post("http://localhost:5000/auth/register-seller", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setIsModalOpen(false);
      Swal.fire({ icon: "success", title: "บันทึกสำเร็จ", text: "เพิ่มผู้ขายใหม่เรียบร้อยแล้ว", showConfirmButton: false, timer: 1500 });
      fetchUsers();
    } catch (err: any) {
      Swal.fire("ผิดพลาด", err.response?.data?.message || "ไม่สามารถเพิ่มข้อมูลได้", "error");
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบผู้ใช้งาน "${name}" ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BE185D", // ชมพูเข้ม
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://localhost:5000/users/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("สำเร็จ", "ลบข้อมูลผู้ใช้งานเรียบร้อย", "success");
        fetchUsers();
      } catch (err: any) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      
      {/* Overlay สำหรับมือถือ */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - สีกรม */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white flex flex-col p-6 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#BE185D] rounded-xl flex items-center justify-center font-black shadow-lg shadow-pink-900/40">W</div>
            <h1 className="text-2xl font-bold uppercase tracking-tight italic">WELD<span className="text-[#0EA5E9]">PRO</span></h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem label="ภาพรวมระบบ" icon={<LayoutDashboard size={20} />} onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon={<CreditCard size={20} />} onClick={() => navigate("/adminverification")} />
          <SidebarItem label="อนุมัติสินค้า" icon={<Package size={20} />} onClick={() => navigate("/adminproductapproval")} />
          <SidebarItem label="จัดการผู้ใช้งาน" icon={<Users size={20} />} active/>
        </nav>

        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="flex items-center gap-3 p-4 text-slate-400 hover:text-[#BE185D] transition-colors font-bold text-xs uppercase tracking-widest mt-auto border-t border-white/5 pt-6">
          <LogOut size={18} /> ออกจากระบบ
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tighter italic">จัดการผู้ใช้งาน</h1>
                <p className="text-slate-500 text-sm font-medium">ดูรายชื่อ ค้นหา และเพิ่มสิทธิ์เจ้าหน้าที่ในระบบ</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="bg-[#BE185D] hover:bg-[#9D174D] text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-pink-200 flex items-center gap-2 active:scale-95">
                <UserPlus size={18} /> เพิ่มผู้ขายใหม่
              </button>
            </div>

            {/* ค้นหาและกรอง */}
            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" placeholder="ค้นหาด้วยชื่อ" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#0EA5E9]/10 focus:border-[#0EA5E9] outline-none transition-all text-sm font-medium"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase ml-2">สิทธิ์การใช้งาน:</span>
                <select 
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-[#0EA5E9]/10 transition-all cursor-pointer"
                  value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="admin">Admin (ผู้ดูแล)</option>
                  <option value="seller">Seller (ผู้ขาย)</option>
                  <option value="customer">Customer (ลูกค้า)</option>
                </select>
              </div>
            </div>

            {/* ตารางข้อมูล */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-500">
                      <th className="px-8 py-5">ข้อมูลโปรไฟล์</th>
                      <th className="px-8 py-5">ระดับสิทธิ์</th>
                      <th className="px-8 py-5 hidden md:table-cell">วันที่เข้าร่วม</th>
                      <th className="px-8 py-5">สถานะ</th>
                      <th className="px-8 py-5 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={5} className="py-24 text-center text-[#0EA5E9] font-bold animate-pulse italic">กำลังดึงข้อมูลจากเซิร์ฟเวอร์...</td></tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-slate-50/80 transition-all">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-black text-xs border border-[#0EA5E9]/20 group-hover:bg-[#0EA5E9] group-hover:text-white transition-all duration-300">
                                {user.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                              user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                              user.role === 'seller' ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-50 text-slate-500'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-[12px] font-medium text-slate-500 hidden md:table-cell">{user.joinDate}</td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                              user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              {user.status === 'active' ? 'ปกติ' : 'ระงับการใช้งาน'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button onClick={() => handleDeleteUser(user.id, user.name)} className="p-3 text-slate-300 hover:text-[#BE185D] hover:bg-pink-50 rounded-xl transition-all">
                              <Trash2 size={19} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-400 italic">ไม่พบข้อมูลที่คุณค้นหา</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal - สีกรม */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="bg-[#0F172A] p-8 text-white text-center relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
                <div className="w-14 h-14 bg-[#BE185D] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-900/20">
                  <UserPlus size={24} />
                </div>
                <h3 className="text-xl font-bold italic tracking-tight">เพิ่มผู้ขาย</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Personnel Authorization</p>
              </div>
              <form className="p-8 space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="ชื่อ" placeholder="ระบุชื่อ" onChange={(v:string)=>setFormData({...formData, firstName: v})}/>
                  <FormInput label="นามสกุล" placeholder="ระบุนามสกุล" onChange={(v:string)=>setFormData({...formData, lastName: v})}/>
                </div>
                <FormInput label="เบอร์โทรศัพท์" placeholder="08x-xxx-xxxx" icon={<Phone size={14} className="text-[#0EA5E9]"/>} onChange={(v:string)=>setFormData({...formData, phone: v})}/>
                <FormInput label="ชื่อผู้ใช้งาน (Username)" placeholder="สำหรับเข้าสู่ระบบ" icon={<Users size={14} className="text-[#0EA5E9]"/>} onChange={(v:string)=>setFormData({...formData, username: v})}/>
                <FormInput label="รหัสผ่าน (Password)" type="password" placeholder="ไม่ต่ำกว่า 6 ตัวอักษร" icon={<ShieldCheck size={14} className="text-[#0EA5E9]"/>} onChange={(v:string)=>setFormData({...formData, password: v})}/>
                
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold text-sm">ยกเลิก</button>
                  <button type="submit" className="flex-[2] bg-[#BE185D] hover:bg-[#9D174D] text-white py-4 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95">บันทึกข้อมูลผู้ขาย</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Internal Components ---
function SidebarItem({ label, icon, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${active ? "bg-[#BE185D] text-white shadow-lg shadow-pink-900/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
      <span className={`${active ? "text-white" : "text-slate-500 group-hover:text-[#0EA5E9]"}`}>{icon}</span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  );
}

function FormInput({ label, placeholder, type = "text", icon, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-slate-500 ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <input 
        required type={type} placeholder={placeholder} 
        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#0EA5E9]/5 focus:border-[#0EA5E9] outline-none text-sm font-medium transition-all"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}