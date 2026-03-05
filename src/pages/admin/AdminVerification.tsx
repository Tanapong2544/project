import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Types สำหรับข้อมูล ---
interface OrderSummary {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  slipUrl?: string; // เพิ่มฟิลด์รูปสลิป
}

export default function AdminVerification() {
  const navigate = useNavigate();

  // ข้อมูลรายการสั่งซื้อ (ในอนาคตดึงจาก NestJS + TypeORM)
  const [orders, setOrders] = useState<OrderSummary[]>([
    {
      id: "ORD-2024-001",
      customerName: "ธนกฤต วิศวกรรม",
      amount: 3500.0,
      date: "18 ม.ค. 2026",
      status: "pending",
      slipUrl: "https://via.placeholder.com/400x600?text=Slip+1",
    },
    {
      id: "ORD-2024-002",
      customerName: "สมชาย รักเชื่อม",
      amount: 1250.0,
      date: "18 ม.ค. 2026",
      status: "pending",
      slipUrl: "https://via.placeholder.com/400x600?text=Slip+2",
    },
    {
      id: "ORD-2024-003",
      customerName: "บริษัท เอ็นดีที จำกัด",
      amount: 7000.0,
      date: "17 ม.ค. 2026",
      status: "approved",
    },
  ]);

  // เก็บ State ว่าตอนนี้กำลังตรวจ Order ไหนอยู่
  const [activeOrder, setActiveOrder] = useState<OrderSummary>(orders[0]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter italic">
            WELD<span className="text-[#FF85A2]">ADMIN</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
            Admin Account
          </p>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarItem
            label="ภาพรวมระบบ"
            icon="📊"
            onClick={() => navigate("/admindashboard")}
          />
          <SidebarItem label="ตรวจสอบสลิป" icon="💳" active />
          <SidebarItem label="อนุมัติสินค้า" icon="📦" onClick={() => navigate("/adminproductapproval")} /> 
          <SidebarItem label="รายชื่อผู้ใช้" icon="👥" onClick={() => navigate("/adminusers")}/>
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* ฝั่งซ้าย: ตารางรายการสั่งซื้อล่าสุด*/}
          <div className="xl:col-span-2 space-y-6">
            <header>
              <h2 className="text-2xl font-black text-[#0F172A]">
                Verification Center
              </h2>
              <p className="text-slate-400 text-sm italic">
                เลือกรายการเพื่อตรวจสอบหลักฐานการโอนเงิน
              </p>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 font-bold text-[#0F172A]">
                รายการสั่งซื้อทั้งหมด
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">ลูกค้า</th>
                      <th className="px-6 py-4">ยอดชำระ</th>
                      <th className="px-6 py-4">สถานะ</th>
                      <th className="px-6 py-4 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setActiveOrder(order)}
                        className={`cursor-pointer transition ${activeOrder.id === order.id ? "bg-pink-50/50" : "hover:bg-slate-50/50"}`}
                      >
                        <td className="px-6 py-4 font-mono text-xs">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 font-bold">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#0F172A]">
                          ฿{order.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                              order.status === "pending"
                                ? "bg-amber-50 text-amber-500"
                                : "bg-green-50 text-green-500"
                            }`}
                          >
                            {order.status === "pending" ? "รอตรวจ" : "สำเร็จ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-[10px] font-bold text-[#FF85A2] uppercase">
                            เรียกดู
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: แสดงรูปสลิปและปุ่มอนุมัติ (Preview) */}
          <div className="xl:col-span-1 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Slip Preview
            </h3>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white sticky top-12">
              <div className="aspect-[3/4] bg-slate-100 rounded-3xl mb-6 overflow-hidden border border-slate-100">
                <img
                  src={
                    activeOrder.slipUrl ||
                    "https://via.placeholder.com/300x400?text=No+Slip"
                  }
                  className="w-full h-full object-cover"
                  alt="Slip"
                />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    ยอดโอน
                  </span>
                  <span className="text-lg font-black text-[#FF85A2]">
                    ฿{activeOrder.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    อ้างอิง
                  </span>
                  <span className="text-xs font-bold">{activeOrder.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-[#0F172A] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition shadow-lg shadow-slate-200">
                  อนุมัติ
                </button>
                <button className="bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition">
                  ปฏิเสธ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---
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
