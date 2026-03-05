import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Types สำหรับข้อมูลผู้ใช้งาน ---
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

  // ข้อมูลผู้ใช้งาน Mockup
  const [users] = useState<User[]>([
    {
      id: "USR-001",
      name: "ธนกฤต วิศวกรรม",
      email: "thanakrit.v@email.com",
      role: "customer",
      status: "active",
      joinDate: "12 ม.ค. 2026",
    },
    {
      id: "USR-002",
      name: "สมชาย รักเชื่อม",
      email: "somchai.weld@email.com",
      role: "seller",
      status: "active",
      joinDate: "05 ม.ค. 2026",
    },
    {
      id: "USR-003",
      name: "บริษัท เอ็นดีที จำกัด",
      email: "info@ndt-corp.com",
      role: "customer",
      status: "suspended",
      joinDate: "20 ธ.ค. 2025",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter italic">
            WELD<span className="text-[#FF85A2]">ADMIN</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
            Admin Account
          </p>
        </div>{" "}
        <nav className="flex-1 space-y-2">
          <SidebarItem
            label="ภาพรวมระบบ"
            icon="📊"
            onClick={() => navigate("/admindashboard")}
          />
          <SidebarItem
            label="ตรวจสอบสลิป"
            icon="💳"
            onClick={() => navigate("/adminverification")}
          />
          <SidebarItem label="อนุมัติสินค้า" icon="📦" onClick={() => navigate("/adminproductapproval")} />
          <SidebarItem label="รายชื่อผู้ใช้" icon="👥" active />
        </nav>
        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-bold w-full"
          >
            <span>🚪</span> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">
              User Management
            </h2>
            <p className="text-slate-400 text-sm italic">
              จัดการสิทธิ์และตรวจสอบรายชื่อผู้ใช้งานทั้งหมด
            </p>
          </div>

          <button className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 transition">
            + เพิ่มเจ้าหน้าที่
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ หรือ อีเมล..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-200 outline-none transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <th className="px-8 py-5">ชื่อผู้ใช้งาน</th>
                  <th className="px-8 py-5">ระดับสิทธิ์ (Role)</th>
                  <th className="px-8 py-5">วันที่เข้าร่วม</th>
                  <th className="px-8 py-5">สถานะ</th>
                  <th className="px-8 py-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-bold text-[#0F172A] text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-600"
                            : user.role === "seller"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {user.joinDate}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span className="text-xs font-bold text-slate-700 capitalize">
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-bold text-[#FF85A2] hover:underline uppercase tracking-tighter">
                        แก้ไขสิทธิ์
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Helper Component ---
function SidebarItem({ label, icon, active = false, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition ${active ? "bg-[#FF85A2] text-white shadow-lg" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}
