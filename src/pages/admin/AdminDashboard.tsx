import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// --- Types สำหรับข้อมูล ---
interface OrderSummary {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
}

// สร้าง Mock Data สำหรับแต่ละช่วงเวลาและกราฟ
const dataByTime = {
  daily: {
    sales: "฿3,500",
    orders: 12,
    pending: 2,
    label: "วันนี้",
    chartData: [
      { name: "เช้า", sales: 1200, orders: 4 },
      { name: "บ่าย", sales: 1500, orders: 5 },
      { name: "เย็น", sales: 800, orders: 3 },
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

  const orders: OrderSummary[] = [
    { id: "ORD-2024-001", customerName: "ธนกฤต วิศวกรรม", amount: 3500.0, date: "18 ม.ค. 2026", status: "pending" },
    { id: "ORD-2024-002", customerName: "สมชาย รักเชื่อม", amount: 1250.0, date: "18 ม.ค. 2026", status: "pending" },
    { id: "ORD-2024-003", customerName: "บริษัท เอ็นดีที จำกัด", amount: 7000.0, date: "17 ม.ค. 2026", status: "approved" },
  ];

  const currentChartData = dataByTime[timeRange].chartData;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter italic">
            WELD<span className="text-[#FF85A2]">ADMIN</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Admin Account</p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem label="ภาพรวมระบบ" icon="📊" active onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon="💳" onClick={() => navigate("/adminverification")} />
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">Dashboard Overview</h2>
            <p className="text-slate-400 text-sm italic">ข้อมูลสถิติแยกตามช่วงเวลา</p>
          </div>

          <div className="bg-slate-200/50 p-1 rounded-2xl flex gap-1">
            {(["daily", "weekly", "monthly"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTimeRange(type)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  timeRange === type 
                  ? "bg-white text-[#0F172A] shadow-sm" 
                  : "text-slate-500 hover:text-[#0F172A]"
                }`}
              >
                {type === "daily" ? "รายวัน" : type === "weekly" ? "รายสัปดาห์" : "รายเดือน"}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="ยอดขายรวม"
            value={dataByTime[timeRange].sales}
            subValue={`สรุปยอด${dataByTime[timeRange].label}`}
            color="text-[#0F172A]"
          />
          <StatCard
            title="สลิปรอการตรวจสอบ"
            value={`${dataByTime[timeRange].pending} รายการ`}
            subValue="ต้องตรวจสอบหลักฐาน"
            color="text-[#FF85A2]"
            onClick={() => navigate("/adminverification")}
          />
          <StatCard
            title="ออเดอร์ทั้งหมด"
            value={dataByTime[timeRange].orders}
            subValue={`รายการสั่งซื้อ${dataByTime[timeRange].label}`}
            color="text-[#0F172A]"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-[#0F172A] mb-6">ยอดขายและจำนวนออเดอร์ ({dataByTime[timeRange].label})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="ยอดขาย (฿)" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="จำนวนออเดอร์" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-[#0F172A] mb-6">ภาพรวมจำนวนออเดอร์ ({dataByTime[timeRange].label})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#FF85A2" name="จำนวนออเดอร์" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}

// --- Sub Components (SidebarItem & StatCard) ---

interface SidebarItemProps {
  label: string;
  icon: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

function SidebarItem({ label, icon, active = false, badge = 0, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
        active
          ? "bg-[#FF85A2] text-white shadow-lg shadow-pink-500/20"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {badge > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ${
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
  color: string;
  onClick?: () => void;
}

function StatCard({ title, value, subValue, color, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition ${
        onClick ? "cursor-pointer hover:border-pink-200" : ""
      }`}
    >
      <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">
        {title}
      </p>
      <h4 className={`text-3xl font-black mb-1 ${color}`}>{value}</h4>
      <p className="text-[10px] text-slate-400 italic font-medium">
        {subValue}
      </p>
    </div>
  );
}