import React from "react";
import { useNavigate } from "react-router-dom";

// --- 1. Interfaces (กำหนด Type ให้ TypeScript) ---

interface CurrentUser {
  name: string;
  shopName: string;
  avatar: string;
  role: string;
  id: string;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

interface SidebarLinkProps {
  label: string;
  icon: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

// --- 2. Main Dashboard Component ---

export default function SellerDashboard() {
  const navigate = useNavigate();

  const currentUser: CurrentUser = {
    name: "สถาพร มั่นคง",
    shopName: "WeldMaster Thailand",
    avatar: "",
    role: "Professional Seller",
    id: "SL-7721"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate('/SellerDashboard')}>
          <h1 className="text-xl font-black tracking-tighter italic">WELD<span className="text-[#FF85A2]">SELLER</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Seller Account</p>
        </div>
        
        {/* Profile ย่อใน Sidebar */}
        <div className="mb-8 px-2 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
            <img src={currentUser.avatar} className="w-10 h-10 rounded-xl" alt="profile" />
            <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{currentUser.name}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.id}</p>
            </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink label="ภาพรวมระบบ" icon="📊" active />
          <SidebarLink label="จัดการสินค้า" icon="📦" onClick={() => navigate('/SellerInventory')} />
          <SidebarLink label="คำสั่งซื้อ" icon="📑" onClick={() => navigate('/SellerOrders')} />
        </nav>
        
        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-bold w-full p-2"
          >
            <span>🚪</span> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Overview</h2>
            <p className="text-slate-400 text-sm font-medium">
              สวัสดีครับคุณ <span className="text-[#FF85A2] font-black">{currentUser.name.split(' ')[0]}</span>, วันนี้ร้านของคุณเป็นอย่างไรบ้าง?
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-xs font-black">{currentUser.shopName}</p>
               <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">● {currentUser.role}</p>
            </div>
          </div>
        </header>

        {/* 1. Stats Cards (ตัวเลขสำคัญ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="รายได้เดือนนี้" value="฿45,200" change="+12.5%" isPositive icon="💰" />
          <StatCard title="ออเดอร์ใหม่" value="128" change="+5.2%" isPositive icon="📦" />
          <StatCard title="ผู้เข้าชมร้าน" value="1,240" change="-2.1%" isPositive={false} icon="👥" />
          <StatCard title="ความพึงพอใจ" value="4.9 / 5" change="Stable" isPositive icon="⭐" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Tasks & Recent Orders (ด้านซ้าย) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
               <h3 className="text-sm font-black text-[#0F172A] mb-6 flex items-center gap-2 uppercase tracking-tighter">
                 <span className="p-2 bg-slate-50 rounded-lg">🔔</span> งานที่ต้องทำ (To-do List)
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TodoItem label="ออเดอร์รอการจัดส่ง" count={2} color="bg-amber-50 text-amber-600" />
                  <TodoItem label="สินค้าที่สต็อกใกล้หมด" count={5} color="bg-red-50 text-red-600" />
               </div>
            </section>

            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-tighter">คำสั่งซื้อล่าสุด</h3>
                  <button className="text-[10px] font-black text-[#FF85A2] uppercase hover:underline" onClick={() => navigate('/SellerOrders')}>ดูทั้งหมด</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[9px] uppercase font-black text-slate-400">
                     <tr>
                       <th className="px-8 py-4">ID</th>
                       <th className="px-8 py-4">ลูกค้า</th>
                       <th className="px-8 py-4 text-right">ยอดรวม</th>
                       <th className="px-8 py-4 text-right">สถานะ</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      <OrderRow id="ORD-9901" user="สมชาย สายเชื่อม" total="15,500" status="รอส่ง" />
                      <OrderRow id="ORD-9902" user="วิชัย งานดี" total="2,400" status="กำลังส่ง" />
                   </tbody>
                 </table>
               </div>
            </section>
          </div>

          {/* 3. สินค้าขายดี (ด้านขวา) */}
          <aside className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
             <h3 className="text-sm font-black mb-8 uppercase tracking-widest text-[#FF85A2]">สินค้าขายดี 3 อันดับ</h3>
             <div className="space-y-8">
                <TopProductItem rank={1} name="เครื่องเชื่อม MIG 200A" sales={45} />
                <TopProductItem rank={2} name="หน้ากากเชื่อม Auto" sales={32} />
                <TopProductItem rank={3} name="ลวดเชื่อมสแตนเลส" sales={18} />
             </div>
             
             <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">เคล็ดลับการขาย</p>
                <p className="text-xs text-slate-300 leading-relaxed">ช่วงนี้สินค้าประเภท <span className="text-white font-bold">อุปกรณ์เซฟตี้</span> กำลังมาแรง ลองเพิ่มสินค้ากลุ่มนี้เพื่อเพิ่มยอดขาย!</p>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// --- 3. Sub-components (TypeScript Version) ---

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <span className="text-2xl">{icon}</span>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {change}
      </span>
    </div>
    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{title}</p>
    <h4 className="text-2xl font-black text-[#0F172A]">{value}</h4>
  </div>
);

const TodoItem: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div className={`p-6 rounded-3xl flex justify-between items-center transition-transform hover:scale-[1.02] cursor-pointer ${color}`}>
    <span className="text-xs font-black uppercase tracking-tighter">{label}</span>
    <span className="text-2xl font-black">{count}</span>
  </div>
);

const OrderRow: React.FC<{ id: string; user: string; total: string; status: string }> = ({ id, user, total, status }) => (
  <tr className="hover:bg-slate-50/50 transition group cursor-pointer">
    <td className="px-8 py-5 text-[10px] font-black text-[#0F172A]">{id}</td>
    <td className="px-8 py-5 text-xs font-bold text-slate-500">{user}</td>
    <td className="px-8 py-5 text-xs font-black text-right">฿{total}</td>
    <td className="px-8 py-5 text-right">
      <span className="text-[9px] font-black uppercase px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-[#0F172A] group-hover:text-white transition-all">
        {status}
      </span>
    </td>
  </tr>
);

const TopProductItem: React.FC<{ rank: number; name: string; sales: number }> = ({ rank, name, sales }) => (
  <div className="flex items-center gap-4 group">
    <span className="text-3xl font-black text-[#FF85A2] italic opacity-40 group-hover:opacity-100 transition-opacity">0{rank}</span>
    <div>
      <p className="text-sm font-black text-white line-clamp-1 group-hover:text-[#FF85A2] transition-colors">{name}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ยอดขาย {sales} ชิ้น</p>
    </div>
  </div>
);

const SidebarLink: React.FC<SidebarLinkProps> = ({ label, icon, active = false, badge = 0, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-[#FF85A2] text-white shadow-lg shadow-pink-200/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
    {badge > 0 && <span className="bg-white text-[#FF85A2] text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);