import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Package,
  Users,
  LogOut,
  TrendingUp,
  ShoppingBag,
  Clock,
  Menu,
  X,
  ChevronRight,
  ArrowUpRight,
  Activity
} from "lucide-react";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";

// --- Mock Data ---
const dataByTime = {
  daily: {
    sales: 3500,
    orders: 12,
    pending: 2,
    label: "วันนี้",
    chartData: [
      { name: "08:00", sales: 1200, orders: 4 },
      { name: "12:00", sales: 1500, orders: 5 },
      { name: "18:00", sales: 800, orders: 3 },
    ],
  },
  weekly: {
    sales: 24800,
    orders: 85,
    pending: 5,
    label: "สัปดาห์นี้",
    chartData: [
      { name: "จันทร์", sales: 3000, orders: 10 },
      { name: "อังคาร", sales: 4500, orders: 15 },
      { name: "พุธ", sales: 3800, orders: 12 },
      { name: "พฤหัส", sales: 5200, orders: 18 },
      { name: "ศุกร์", sales: 6000, orders: 20 },
      { name: "เสาร์", sales: 1500, orders: 5 },
      { name: "อาทิตย์", sales: 800, orders: 3 },
    ],
  },
  monthly: {
    sales: 112750,
    orders: 420,
    pending: 18,
    label: "เดือนนี้",
    chartData: [
      { name: "สัปดาห์ 1", sales: 25000, orders: 100 },
      { name: "สัปดาห์ 2", sales: 30000, orders: 120 },
      { name: "สัปดาห์ 3", sales: 35000, orders: 140 },
      { name: "สัปดาห์ 4", sales: 22750, orders: 60 },
    ],
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const currentChartData = dataByTime[timeRange].chartData;

  return (
    <div className="h-screen w-full bg-[#F1F5F9] flex overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar - สีกรม (คงที่) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white flex flex-col p-6 
        transition-transform duration-300 lg:relative lg:translate-x-0 
        flex-shrink-0 border-r border-white/5
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-9 h-9 bg-[#BE185D] rounded-xl flex items-center justify-center font-black shadow-lg shadow-pink-900/40">W</div>
          <h1 className="text-2xl font-bold uppercase tracking-tight italic">WELD<span className="text-[#0EA5E9]">ADMIN</span></h1>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          <SidebarItem label="ภาพรวมระบบ" icon={<LayoutDashboard size={20} />} active />
          <SidebarItem label="ตรวจสอบสลิป" icon={<CreditCard size={20} />} onClick={() => navigate("/adminverification")} />
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] relative overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white flex-shrink-0">
          <h1 className="text-2xl font-bold uppercase tracking-tight italic">WELD<span className="text-[#0EA5E9]">ADMIN</span></h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/10 rounded-lg text-white">
            <Menu size={20} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Header Section */}
            <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-[#BE185D]/10 rounded-lg">
                      <Activity className="text-[#BE185D]" size={24} />
                   </div>
                   <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Dashboard Overview</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium">สรุปผลการดำเนินงานและสถิติในรูปแบบกราฟิก</p>
              </div>

              <div className="flex bg-white p-1.5 rounded-[1.25rem] shadow-sm border border-slate-200">
                {(["daily", "weekly", "monthly"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTimeRange(type)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      timeRange === type ? "bg-[#0F172A] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {type === "daily" ? "รายวัน" : type === "weekly" ? "รายสัปดาห์" : "รายเดือน"}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <StatCard
                title="ยอดขายรวม"
                value={`${dataByTime[timeRange].sales.toLocaleString()} บาท`}
                subValue={`ยอดขายสะสม ${dataByTime[timeRange].label}`}
                icon={<TrendingUp size={24} />}
                trend="+12.5%"
                color="pink"
              />
              <StatCard
                title="รอตรวจสอบสลิป"
                value={`${dataByTime[timeRange].pending} รายการ`}
                subValue="รายการที่รอการยืนยันการโอน"
                icon={<Clock size={24} />}
                onClick={() => navigate("/adminverification")}
                highlight
                color="amber"
              />
              <StatCard
                title="ออเดอร์ทั้งหมด"
                value={`${dataByTime[timeRange].orders} ออเดอร์`}
                subValue="จำนวนคำสั่งซื้อสำเร็จทั้งหมด"
                icon={<ShoppingBag size={24} />}
                color="blue"
              />
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
              <ChartContainer title="สถิติกราฟยอดขาย" unit="บาท" icon={<TrendingUp size={18} />}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#BE185D" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#BE185D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#BE185D" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer title="จำนวนคำสั่งซื้อ" unit="รายการ" icon={<ShoppingBag size={18} />}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="orders" fill="#0EA5E9" radius={[8, 8, 0, 0]} barSize={32} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </section>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-[#0F172A]/80 z-40 lg:hidden backdrop-blur-md transition-opacity" onClick={() => setSidebarOpen(false)} />
        )}
      </main>
    </div>
  );
}

// --- Helper Components ---

function SidebarItem({ label, icon, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
        active 
          ? "bg-[#BE185D] text-white shadow-xl shadow-pink-900/40" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={active ? "text-white" : "text-slate-500"}>{icon}</span>
        <span className="text-sm font-black uppercase tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

function StatCard({ title, value, subValue, icon, trend, highlight, onClick, color }: any) {
  const colorSchemes: any = {
    pink: "bg-pink-50 text-[#BE185D] border-pink-100",
    blue: "bg-blue-50 text-[#0EA5E9] border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-500 group relative overflow-hidden ${
        onClick ? "cursor-pointer hover:border-[#BE185D]/30 hover:-translate-y-2" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-4 rounded-2xl transition-colors ${colorSchemes[color] || "bg-slate-50 text-slate-400"}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <ArrowUpRight size={12} /> {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{value}</h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold italic">
          <div className={`w-2 h-2 rounded-full ${highlight ? 'animate-pulse bg-[#BE185D]' : 'bg-slate-200'}`} />
          {subValue}
        </div>
      </div>
      {/* Background Decor */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
    </div>
  );
}

function ChartContainer({ title, unit, icon, children }: any) {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
            {icon}
          </div>
          <div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{title}</h3>
            <p className="text-xs font-bold text-slate-800 uppercase italic underline decoration-[#BE185D] decoration-2 underline-offset-4 tracking-widest">Unit: {unit}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
           <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
           <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      </div>
      <div className="flex-1 min-h-[300px] w-full">
        {children}
      </div>
    </div>
  );
}