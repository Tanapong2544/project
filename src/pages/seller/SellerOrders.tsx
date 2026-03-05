import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- 1. Interfaces สำหรับข้อมูลคำสั่งซื้อ ---

interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  deliveryStatus: "รอจัดส่ง" | "กำลังจัดส่ง" | "สำเร็จแล้ว" | "ยกเลิก";
  items: number;
}

interface SidebarLinkProps {
  label: string;
  icon: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

// --- 2. Sub-components ---

const OrderStatusBadge: React.FC<{ status: Order["deliveryStatus"] }> = ({ status }) => {
  const styles: Record<string, string> = {
    "รอจัดส่ง": "bg-amber-50 text-amber-600 border-amber-100",
    "กำลังจัดส่ง": "bg-blue-50 text-blue-600 border-blue-100",
    "สำเร็จแล้ว": "bg-green-50 text-green-600 border-green-100",
    "ยกเลิก": "bg-slate-50 text-slate-400 border-slate-100",
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-[10px] font-black tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ label, icon, active = false, badge = 0, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-[#FF85A2] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
    {badge > 0 && <span className="bg-white text-[#FF85A2] text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

// --- 3. Main Component ---

export default function SellerOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("ทั้งหมด");

  const currentUser = {
    name: "สถาพร มั่นคง",
    id: "SL-7721",
    avatar: "https://ui-avatars.com/api/?name=Sathaporn+Mankong&background=0F172A&color=fff"
  };

  const [orders] = useState<Order[]>([
    { id: "ORD-9901", customerName: "สมชาย สายเชื่อม", date: "07 ก.พ. 2026", total: 15500, items: 2, deliveryStatus: "รอจัดส่ง" },
    { id: "ORD-9902", customerName: "วิชัย งานดี", date: "06 ก.พ. 2026", total: 2400, items: 1, deliveryStatus: "กำลังจัดส่ง" },
    { id: "ORD-9903", customerName: "มานี มีของ", date: "05 ก.พ. 2026", total: 850, items: 3, deliveryStatus: "สำเร็จแล้ว" },
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate('/SellerDashboard')}>
          <h1 className="text-xl font-black tracking-tighter italic">WELD<span className="text-[#FF85A2]">SELLER</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Seller Account</p>
        </div>

        {/* Profile Section ใน Sidebar */}
        <div className="mb-8 px-2 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-xl" alt="profile" />
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate">{currentUser.name}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.id}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink label="ภาพรวมระบบ" icon="📊" onClick={() => navigate('/SellerDashboard')} />
          <SidebarLink label="จัดการสินค้า" icon="📦" onClick={() => navigate('/SellerInventory')} />
          <SidebarLink label="คำสั่งซื้อ" icon="📑" active badge={orders.filter(o => o.deliveryStatus === "รอจัดส่ง").length} />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-bold w-full p-2">
            <span>🚪</span> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Orders</h2>
            <p className="text-slate-400 text-sm font-medium">จัดการรายการสั่งซื้อสำหรับคุณ <span className="text-[#0F172A] font-bold">{currentUser.name.split(' ')[0]}</span></p>
          </div>
          
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            {["ทั้งหมด", "รอจัดส่ง", "กำลังจัดส่ง"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filter === tab ? 'bg-[#0F172A] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Search & Table Area */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="p-8 border-b border-slate-50">
             <div className="relative max-w-md">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-sm">🔍</span>
                <input 
                  type="text" 
                  placeholder="ค้นหา Order ID หรือชื่อลูกค้า..." 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                  <th className="px-8 py-5">Order ID / วันที่</th>
                  <th className="px-8 py-5">ข้อมูลลูกค้า</th>
                  <th className="px-8 py-5 text-right">ยอดชำระ</th>
                  <th className="px-8 py-5 text-center">สถานะ</th>
                  <th className="px-8 py-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[#0F172A]">
                {orders.filter(o => filter === "ทั้งหมด" || o.deliveryStatus === filter).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black underline decoration-[#FF85A2] decoration-2 underline-offset-4 cursor-pointer">{order.id}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{order.date}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-medium italic">สินค้า {order.items} รายการ</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-right">฿{order.total.toLocaleString()}</td>
                    <td className="px-8 py-6 text-center">
                      <OrderStatusBadge status={order.deliveryStatus} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#FF85A2] transition-colors shadow-sm">
                        ดูข้อมูล
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