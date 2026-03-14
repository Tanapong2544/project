import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, CreditCard, Package, Users, 
  LogOut, CheckCircle, XCircle, Search,
  ShieldCheck, ChevronRight, Menu, X,
  Eye, AlertCircle, Calendar, ArrowUpRight
} from "lucide-react";

// --- Interfaces ---
interface OrderSummary {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  slipUrl?: string;
}

export default function AdminVerification() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [orders] = useState<OrderSummary[]>([
    { id: "ORD-001", customerName: "ธนกฤต วิศวกรรม", amount: 3500.0, date: "18 มี.ค. 2026", status: "pending" },
    { id: "ORD-002", customerName: "สมชาย รักเชื่อม", amount: 1250.0, date: "18 มี.ค. 2026", status: "pending" },
    { id: "ORD-003", customerName: "บริษัท เอ็นดีที จำกัด", amount: 7000.0, date: "17 มี.ค. 2026", status: "approved" },
  ]);

  const [activeOrder, setActiveOrder] = useState<OrderSummary>(orders[0]);

  return (
    <div className="h-screen w-full bg-[#F1F5F9] flex overflow-hidden font-sans text-slate-900">
      
      {/* 1. Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white flex flex-col p-6 
        transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-10 px-2 lg:block">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#BE185D] rounded-xl flex items-center justify-center font-black shadow-lg shadow-pink-900/40 text-white">W</div>
            <h1 className="text-2xl font-bold uppercase tracking-tight italic">WELD<span className="text-[#0EA5E9]">PRO</span></h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          <SidebarItem label="ภาพรวมระบบ" icon={<LayoutDashboard size={20} />} onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon={<CreditCard size={20} />} active />
          <SidebarItem label="อนุมัติสินค้า" icon={<Package size={20} />} onClick={() => navigate("/adminproductapproval")} />
          <SidebarItem label="จัดการผู้ใช้งาน" icon={<Users size={20} />} onClick={() => navigate("/adminusers")} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} 
                  className="flex items-center gap-3 w-full p-4 text-slate-400 hover:text-[#BE185D] transition-all font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/5">
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#BE185D] rounded-lg flex items-center justify-center text-[10px] font-black">W</div>
            <h1 className="font-bold italic uppercase tracking-tighter">WELDPRO</h1>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/10 rounded-lg">
            <Menu size={20} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#BE185D] rounded-lg shadow-md">
                    <ShieldCheck className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase italic">ตรวจสอบสลิปการโอนเงิน</h2>
                </div>
                <p className="hidden sm:block text-slate-500 text-xs font-bold mt-1 ml-1">ยืนยันหลักฐานการโอนเงิน</p>
              </div>
              
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="ค้นหา..." 
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#BE185D] outline-none text-sm font-bold transition-all"
                />
              </div>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Table List */}
              <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden order-2 lg:order-1">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                        <th className="px-8 py-5">รายการ</th>
                        <th className="px-8 py-5">ลูกค้า</th>
                        <th className="px-8 py-5 text-right">ยอดเงิน</th>
                        <th className="px-8 py-5 text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => setActiveOrder(order)}
                          className={`group cursor-pointer transition-all duration-300 ${
                            activeOrder.id === order.id ? "bg-[#0EA5E9]/5" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                               <div className={`w-1 h-8 rounded-full ${activeOrder.id === order.id ? "bg-[#BE185D]" : "bg-transparent"}`} />
                               <div>
                                 <p className="font-black text-slate-900 text-sm tracking-tight">{order.id}</p>
                                 <p className="text-[10px] text-slate-400 font-bold">{order.date}</p>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-700 text-xs md:text-sm">
                             {order.customerName}
                          </td>
                          <td className="px-6 py-5 text-right font-black text-slate-900">
                             {order.amount.toLocaleString()} <span className="text-[9px] text-slate-400 ml-0.5">บาท</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                              order.status === "pending" 
                              ? "bg-amber-50 text-amber-600 border-amber-100" 
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}>
                              {order.status === "pending" ? "รอตรวจ" : "สำเร็จ"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Preview & New Colored Buttons */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 order-1 lg:order-2">
                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-300/60 overflow-hidden">
                  <div className="bg-[#0F172A] p-5 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Eye size={14} className="text-[#0EA5E9]" />
                      <h3 className="font-black text-[10px] tracking-widest uppercase">SLIP PREVIEW</h3>
                    </div>
                    <span className="text-[10px] bg-[#BE185D] px-3 py-1 rounded-full font-black tracking-tighter italic">
                      {activeOrder.id}
                    </span>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <div className="aspect-square sm:aspect-[4/3] lg:aspect-[3/4] bg-slate-100 rounded-[1.5rem] md:rounded-[2rem] mb-6 overflow-hidden border border-slate-100 relative group shadow-inner">
                      <img
                        src={activeOrder.slipUrl || "https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=400"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Slip"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                         <button className="bg-white text-slate-900 p-3 rounded-full shadow-2xl">
                            <ArrowUpRight size={20} />
                         </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ยอดเงินโอน</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                            {activeOrder.amount.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">บาท</span>
                        </span>
                      </div>
                      <div className="h-px bg-slate-200/60 w-full mb-3" />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold uppercase text-[9px]">ลูกค้า</span>
                        <span className="text-slate-800 font-black truncate max-w-[150px]">{activeOrder.customerName}</span>
                      </div>
                    </div>

                    {/* Action Buttons with requested colors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                      {/* อนุมัติ - สีเขียว */}
                      <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
                        <CheckCircle size={16} /> อนุมัติ
                      </button>
                      
                      {/* ปฏิเสธ - สีแดง */}
                      <button className="flex items-center justify-center gap-2 bg-rose-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 active:scale-95">
                        <XCircle size={16} /> ปฏิเสธ
                      </button>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex gap-3">
                      <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
                      <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">
                        โปรดตรวจสอบยอดเงินและชื่อบัญชีให้ถูกต้องก่อนกดยืนยัน
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-[#0F172A]/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}
      </main>
    </div>
  );
}

// SidebarItem Component
function SidebarItem({ label, icon, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300
        ${active 
          ? "bg-[#BE185D] text-white shadow-xl shadow-pink-900/40" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <span className={active ? "text-white" : "text-slate-500"}>{icon}</span>
        <span className="text-xs md:text-sm font-black uppercase tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="hidden sm:block" />}
    </button>
  );
}