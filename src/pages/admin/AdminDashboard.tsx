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
  ArrowUpRight,
  BarChart3
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// --- Types ---
interface OrderSummary {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const dataByTime = {
  daily: {
    sales: "฿3,500",
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
    sales: "฿24,800",
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
    sales: "฿112,750",
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

  const currentChartData = dataByTime[timeRange].chartData;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter italic">
            WELD<span className="text-[#FF85A2]">ADMIN</span>
          </h1>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Central Authority</p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} active onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon={<CreditCard size={18} />} onClick={() => navigate("/adminverification")} />
          <SidebarItem label="อนุมัติสินค้า" icon={<Package size={18} />} onClick={() => navigate("/adminproductapproval")} />
          <SidebarItem label="รายชื่อผู้ใช้" icon={<Users size={18} />} onClick={() => navigate("/adminusers")} />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-black w-full p-2 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-8 bg-[#FF85A2] rounded-full"></span>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Analytics Command Center</p>
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] italic tracking-tighter uppercase">Dashboard</h2>
          </div>

          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1 border border-slate-200/50">
            {(["daily", "weekly", "monthly"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTimeRange(type)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                  timeRange === type ? "bg-white text-[#0F172A] shadow-md" : "text-slate-500 hover:text-[#0F172A]"
                }`}
              >
                {type === "daily" ? "รายวัน" : type === "weekly" ? "รายสัปดาห์" : "รายเดือน"}
              </button>
            ))}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="ยอดขายรวม"
            value={dataByTime[timeRange].sales}
            subValue={`อัปเดตข้อมูล${dataByTime[timeRange].label}`}
            icon={<TrendingUp className="text-emerald-500" size={20} />}
            trend="+12.5%"
          />
          <StatCard
            title="รอตรวจสอบ"
            value={dataByTime[timeRange].pending}
            subValue="สลิปที่ต้องอนุมัติ"
            icon={<Clock className="text-[#FF85A2]" size={20} />}
            onClick={() => navigate("/adminverification")}
            highlight
          />
          <StatCard
            title="ออเดอร์ทั้งหมด"
            value={dataByTime[timeRange].orders}
            subValue="รายการสั่งซื้อสำเร็จ"
            icon={<ShoppingBag className="text-blue-500" size={20} />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          {/* Line Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                    <BarChart3 size={18} />
                </div>
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-tight">Performance Metrics</h3>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dataByTime[timeRange].label}</p>
            </div>
            
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={currentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10}
                />
                <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6366F1" 
                    name="ยอดขาย (฿)" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg text-[#FF85A2]">
                    <ShoppingBag size={18} />
                </div>
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-tight">Order Distribution</h3>
              </div>
              <ArrowUpRight className="text-slate-300" size={18} />
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar 
                    dataKey="orders" 
                    fill="#FF85A2" 
                    name="จำนวนออเดอร์" 
                    radius={[6, 6, 0, 0]} 
                    barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub Components ---

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

function SidebarItem({ label, icon, active = false, badge = 0, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
        active
          ? "bg-[#FF85A2] text-white shadow-lg shadow-pink-500/20"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-white" : "text-slate-500 group-hover:text-white"} transition-colors`}>
            {icon}
        </span>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {badge > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
          active ? "bg-white text-[#FF85A2]" : "bg-[#FF85A2] text-white"
        }`}>
          {badge}
        </span>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: React.ReactNode;
  trend?: string;
  highlight?: boolean;
  onClick?: () => void;
}

function StatCard({ title, value, subValue, icon, trend, highlight, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${
        onClick ? "cursor-pointer" : ""
      } ${highlight ? "border-pink-100 bg-pink-50/10" : "border-slate-50"}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${highlight ? 'bg-pink-100 text-[#FF85A2]' : 'bg-slate-50 text-slate-400'}`}>
          {icon}
        </div>
        {trend && (
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                {trend}
            </span>
        )}
      </div>
      
      <div>
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">
            {title}
        </p>
        <h4 className="text-3xl font-black text-[#0F172A] tracking-tighter mb-1">{value}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">
            {subValue}
        </p>
      </div>

    </div>
  );
}