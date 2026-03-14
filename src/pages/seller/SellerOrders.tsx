import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Package, FileText, LogOut, Search, Eye, 
  Clock, Truck, CheckCircle2, XCircle, Filter, Menu, X, User
} from "lucide-react";

// --- Interfaces ---
interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  deliveryStatus: "รอจัดส่ง" | "กำลังจัดส่ง" | "สำเร็จแล้ว" | "ยกเลิก";
  items: number;
}

// --- Component: ป้ายสถานะ (ปรับให้ดูสะอาดและทางการขึ้น) ---
const OrderStatusBadge: React.FC<{ status: Order["deliveryStatus"] }> = ({ status }) => {
  const config = {
    "รอจัดส่ง": { color: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={12} /> },
    "กำลังจัดส่ง": { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <Truck size={12} /> },
    "สำเร็จแล้ว": { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={12} /> },
    "ยกเลิก": { color: "bg-rose-50 text-rose-500 border-rose-100", icon: <XCircle size={12} /> },
  };
  const current = config[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-tight ${current.color}`}>
      {current.icon}
      {status}
    </div>
  );
};

export default function SellerOrders() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<string>("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  // ข้อมูลจำลอง (Mock Data)
  const [orders] = useState<Order[]>([
    { id: "ORD-2026-001", customerName: "สมชาย งานเชื่อม", date: "07 มี.ค. 2026", total: 3500.00, items: 2, deliveryStatus: "รอจัดส่ง" },
    { id: "ORD-2026-002", customerName: "วิชัย พาณิชย์", date: "06 มี.ค. 2026", total: 12400.50, items: 1, deliveryStatus: "กำลังจัดส่ง" },
    { id: "ORD-2026-003", customerName: "มานี มีทรัพย์", date: "05 มี.ค. 2026", total: 850.25, items: 3, deliveryStatus: "สำเร็จแล้ว" },
  ]);

  const filteredOrders = orders.filter(o => 
    (filter === "ทั้งหมด" || o.deliveryStatus === filter) &&
    (o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900" 
         style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      
      {/* 1. Mobile Navigation */}
      <div className="lg:hidden bg-[#0F172A] p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-white font-bold tracking-tight text-lg uppercase italic">Weld<span className="text-pink-600">Seller</span></h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2 bg-pink-600 rounded-lg">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="hidden lg:block mb-8 px-2">
          <h1 className="text-xl font-extrabold tracking-tight italic">WELD<span className="text-pink-600">SELLER</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} onClick={() => navigate('/SellerDashboard')} />
          <SidebarLink label="คลังสินค้า" icon={<Package size={18} />} onClick={() => navigate('/SellerInventory')} />
          <SidebarLink label="คำสั่งซื้อ" icon={<FileText size={18} />} active badge={orders.filter(o => o.deliveryStatus === "รอจัดส่ง").length} />
        </nav>

        <div className="pt-4 border-t border-slate-800">
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 text-slate-400 hover:text-rose-400 text-sm font-medium w-full p-2.5 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* 3. Main Content */}
      <main className="flex-1 p-5 md:p-10 lg:p-12 overflow-x-hidden">
        <header className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">รายการคำสั่งซื้อ</h2>
            <p className="text-slate-500 text-sm mt-1">ตรวจสอบและจัดการออเดอร์จากลูกค้าทั้งหมด</p>
          </div>
          
          {/* Status Tabs */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 gap-1 overflow-x-auto w-full xl:w-auto">
            {["ทั้งหมด", "รอจัดส่ง", "กำลังจัดส่ง", "สำเร็จแล้ว"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* 4. Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Search & Meta */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="ค้นหาเลขออเดอร์ หรือชื่อลูกค้า..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500 outline-none transition-all"
                />
             </div>
             <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Filter size={14} className="text-pink-600" />
                พบ {filteredOrders.length} รายการที่เกี่ยวข้อง
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50/50 text-[11px] font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4">เลขออเดอร์</th>
                  <th className="px-8 py-4">ข้อมูลลูกค้า</th>
                  <th className="px-8 py-4 text-right">ยอดรวม (บาท)</th>
                  <th className="px-8 py-4 text-center">สถานะ</th>
                  <th className="px-8 py-4 text-right">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{order.id}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Clock size={12} /> {order.date}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-semibold text-slate-700">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                         สินค้า {order.items} รายการ
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-sm font-bold text-slate-900 tracking-tight">
                        {order.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <OrderStatusBadge status={order.deliveryStatus} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all shadow-sm border border-transparent hover:border-pink-100">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <FileText size={40} className="mx-auto text-slate-100 mb-3" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">ไม่พบรายการคำสั่งซื้อ</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/20 flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">แสดงผล {filteredOrders.length} รายการ</p>
             <div className="flex gap-2">
                <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg text-slate-300 cursor-not-allowed bg-white">ก่อนหน้า</button>
                <button className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg shadow hover:bg-pink-600 transition-all">ถัดไป</button>
             </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}

// SidebarLink Helper
const SidebarLink: React.FC<{ label: string; icon: React.ReactNode; active?: boolean; badge?: number; onClick?: () => void }> = ({ 
  label, icon, active = false, badge = 0, onClick 
}) => (
  <div 
    onClick={onClick}
    className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
      active ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? 'text-white' : 'text-pink-500/80 group-hover:text-pink-400'}>{icon}</span>
      <span className={`text-sm tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
    {badge > 0 && (
      <span className={`${active ? 'bg-white text-pink-600' : 'bg-pink-600 text-white'} text-[10px] font-bold px-2 py-0.5 rounded-md`}>
        {badge}
      </span>
    )}
  </div>
);