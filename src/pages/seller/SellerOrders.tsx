import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  LogOut, 
  Search, 
  Eye, 
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  XCircle
} from "lucide-react";

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
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

const OrderStatusBadge: React.FC<{ status: Order["deliveryStatus"] }> = ({ status }) => {
  const config = {
    "รอจัดส่ง": { color: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} /> },
    "กำลังจัดส่ง": { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <Truck size={12} /> },
    "สำเร็จแล้ว": { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={12} /> },
    "ยกเลิก": { color: "bg-slate-50 text-slate-400 border-slate-100", icon: <XCircle size={12} /> },
  };

  const current = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black tracking-tighter ${current.color}`}>
      {current.icon}
      {status}
    </div>
  );
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ label, icon, active = false, badge = 0, onClick }) => (
  <div 
    onClick={onClick}
    className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-[#FF85A2] text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
    {badge > 0 && <span className="bg-white text-[#FF85A2] text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

export default function SellerOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("ทั้งหมด");

  const currentUser = {
    name: "นายเอ สวัสดี",
    id: "ID:1",
    avatar: `https://ui-avatars.com/api/?name=น&background=FF85A2&color=fff&bold=true`
  };

  const [orders] = useState<Order[]>([
    { id: "ORD-001", customerName: "สมชาย สายเชื่อม", date: "07 ก.พ. 2026", total: 3000, items: 2, deliveryStatus: "รอจัดส่ง" },
    { id: "ORD-002", customerName: "วิชัย งานดี", date: "06 ก.พ. 2026", total: 2400, items: 1, deliveryStatus: "กำลังจัดส่ง" },
    { id: "ORD-003", customerName: "มานี มีของ", date: "05 ก.พ. 2026", total: 850, items: 3, deliveryStatus: "สำเร็จแล้ว" },
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate('/SellerDashboard')}>
          <h1 className="text-xl font-black tracking-tighter italic">WELD<span className="text-[#FF85A2]">SELLER</span></h1>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Management Portal</p>
        </div>

        <div className="mb-8 px-2 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-xl shadow-inner" alt="profile" />
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate">{currentUser.name}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.id}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} onClick={() => navigate('/SellerDashboard')} />
          <SidebarLink label="จัดการสินค้า" icon={<Package size={18} />} onClick={() => navigate('/SellerInventory')} />
          <SidebarLink 
            label="คำสั่งซื้อ" 
            icon={<FileText size={18} />} 
            active 
            badge={orders.filter(o => o.deliveryStatus === "รอจัดส่ง").length} 
          />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-black w-full p-2 group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="h-1 w-8 bg-[#FF85A2] rounded-full"></span>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Order Processing</p>
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Orders</h2>
          </div>
          
          <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
            {["ทั้งหมด", "รอจัดส่ง", "กำลังจัดส่ง", "สำเร็จแล้ว"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                    filter === tab 
                    ? 'bg-[#0F172A] text-white shadow-lg' 
                    : 'text-slate-500 hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="ค้นหา Order ID หรือชื่อลูกค้า..." 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#FF85A2]/20 focus:ring-4 focus:ring-pink-50 outline-none transition-all"
                />
             </div>
             <div className="hidden lg:block">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Showing: <span className="text-[#0F172A]">{orders.filter(o => filter === "ทั้งหมด" || o.deliveryStatus === filter).length} Orders</span>
                </p>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[9px] uppercase font-black text-slate-400 tracking-widest">
                  <th className="px-8 py-6">Order ID & Date</th>
                  <th className="px-8 py-6">Customer Details</th>
                  <th className="px-8 py-6 text-right">Total Amount</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[#0F172A]">
                {orders
                    .filter(o => filter === "ทั้งหมด" || o.deliveryStatus === filter)
                    .map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black group-hover:text-[#FF85A2] transition-colors">{order.id}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-1 uppercase">
                        <Clock size={10} />
                        {order.date}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Items: {order.items}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black">{order.total.toLocaleString()} บาท</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <OrderStatusBadge status={order.deliveryStatus} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-[#FF85A2] transition-all shadow-md active:scale-95"
                      >
                        <Eye size={14} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {orders.filter(o => filter === "ทั้งหมด" || o.deliveryStatus === filter).length === 0 && (
                <div className="py-20 text-center">
                    <FileText size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold text-sm">ไม่พบรายการสั่งซื้อในหมวดหมู่นี้</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}