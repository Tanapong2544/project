import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import silpurl from "../../assets/IMG_1118.jpg"
import { 
  LayoutDashboard, 
  CreditCard, 
  Package, 
  Users, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Search,
  ShieldCheck,
  ChevronRight,
  Expand
} from "lucide-react";

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
  const [orders] = useState<OrderSummary[]>([
    {
      id: "ORD-001",
      customerName: "ธนกฤต วิศวกรรม",
      amount: 3500.0,
      date: "18 ม.ค. 2026",
      status: "pending",
      slipUrl: silpurl,
    },
    {
      id: "ORD-002",
      customerName: "สมชาย รักเชื่อม",
      amount: 1250.0,
      date: "18 ม.ค. 2026",
      status: "pending",
      slipUrl: silpurl,
    },
    {
      id: "ORD-003",
      customerName: "บริษัท เอ็นดีที จำกัด",
      amount: 7000.0,
      date: "17 ม.ค. 2026",
      status: "approved",
    },
  ]);

  const [activeOrder, setActiveOrder] = useState<OrderSummary>(orders[0]);

  return (
    <div className="h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      {/* Sidebar - No Outer Shadow Glow */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 relative z-20">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter italic uppercase">
            WELD<span className="text-[#FF85A2]">ADMIN</span>
          </h1>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Verification Unit</p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon={<CreditCard size={18} />} active />
          <SidebarItem label="อนุมัติสินค้า" icon={<Package size={18} />} onClick={() => navigate("/adminproductapproval")} /> 
          <SidebarItem label="รายชื่อผู้ใช้" icon={<Users size={18} />} onClick={() => navigate("/adminusers")}/>
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-black w-full p-2 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">

          <div className="xl:col-span-8 flex flex-col space-y-6">
            <header className="flex justify-between items-end mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} className="text-[#FF85A2]" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Security & Finance</p>
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Verification</h2>
              </div>
              
              <div className="relative hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                 <input 
                  type="text" 
                  placeholder="ค้นหา ID หรือชื่อ..." 
                  className="pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-pink-100 transition-all w-64 shadow-sm"
                 />
              </div>
            </header>

            <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black">
                      <th className="px-8 py-5">Order Reference</th>
                      <th className="px-8 py-5">Customer</th>
                      <th className="px-8 py-5 text-right">Amount</th>
                      <th className="px-8 py-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 border-b border-slate-100">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setActiveOrder(order)}
                        className={`group cursor-pointer transition-all duration-300 ${
                          activeOrder.id === order.id ? "bg-pink-50/30" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-8 py-5 relative">
                          {activeOrder.id === order.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF85A2]" />
                          )}
                          <p className="font-mono text-[11px] font-black text-slate-400 group-hover:text-[#FF85A2] transition-colors uppercase">
                            {order.id}
                          </p>
                          <p className="text-[9px] font-bold text-slate-300 mt-0.5 uppercase tracking-tighter">{order.date}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black tracking-tight">{order.customerName}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <p className="text-sm font-black">฿{order.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                              order.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}
                          >
                            <div className={`w-1 h-1 rounded-full ${order.status === "pending" ? "bg-amber-400" : "bg-emerald-400"}`} />
                            {order.status === "pending" ? "Waiting" : "Verified"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 relative flex flex-col items-center xl:items-start">
            <div className="sticky top-0 space-y-5 w-full max-w-sm">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Preview</h3>
                <button className="text-slate-300 hover:text-[#FF85A2] transition p-1 bg-white rounded-lg shadow-sm border border-slate-50">
                  <Expand size={14} />
                </button>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 relative overflow-hidden w-full shadow-md shadow-black/[0.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -z-0 opacity-40" />
                
                <div className="relative z-10 text-center">
                  <div className="aspect-[3/4] bg-slate-50 rounded-3xl mb-6 overflow-hidden border-4 border-white shadow-inner mx-auto max-w-[260px] group">
                    <img
                      src={activeOrder.slipUrl || "https://via.placeholder.com/300x400?text=No+Slip"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt="Slip"
                    />
                  </div>

                  <div className="space-y-4 mb-6 px-1">
                    <div className="flex justify-between items-end">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-left">Transfer Amount</p>
                      <p className="text-2xl font-black text-[#0F172A] tracking-tighter">
                        ฿{activeOrder.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-px bg-slate-50 w-full" />
                    <div className="grid grid-cols-2 gap-3 text-[9px] font-black uppercase text-left">
                      <div>
                        <p className="text-slate-300 mb-0.5 tracking-widest">Order ID</p>
                        <p className="font-mono text-slate-700">{activeOrder.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 mb-0.5 tracking-widest">Customer</p>
                        <p className="text-slate-700 truncate">{activeOrder.customerName.split(' ')[0]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#0F172A] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-black/10">
                      <CheckCircle size={14} /> อนุมัติ
                    </button>
                    <button className="px-5 bg-slate-50 text-slate-400 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 border border-slate-100">
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 text-center">
                 <p className="text-[9px] font-bold text-slate-300 italic leading-relaxed">
                    โปรดตรวจสอบข้อมูลโอนเงินให้ครบถ้วนก่อนยืนยัน
                 </p>
              </div>
            </div>
          </div>
        </div>
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
        ? "bg-[#FF85A2] text-white shadow-sm" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={`${active ? "text-white" : "text-slate-500 group-hover:text-white"} transition-colors`}>
        {icon}
      </span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </div>
  );
}