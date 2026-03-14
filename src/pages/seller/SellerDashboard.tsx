import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Box, ClipboardList, LogOut, TrendingUp, Users, 
  ShoppingBag, Star, ArrowUpRight, Store, PackageCheck, AlertCircle, 
  Menu, X, Zap
} from "lucide-react";

interface CurrentUser {
  name: string;
  shopName: string;
  avatar: string;
  role: string;
  id: string;
}
interface Seller {
  firstName: string;
  lastName: string;
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentUser: CurrentUser = {
    name: "คุณสมชาย สายเชื่อม",
    shopName: "WeldMaster Thailand",
    avatar: "https://ui-avatars.com/api/?name=Somchai&background=DB2777&color=fff",
    role: "ผู้ขาย",
    id: "ID: 001"
  };

  return (
    // ใช้ font-family ที่เป็นสากลและทางการ
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-[#1E293B]" 
         style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      
      {/* 1. Mobile Header */}
      <div className="lg:hidden bg-[#0F172A] p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-white font-bold tracking-tight text-lg">WELD<span className="text-pink-600">SELLER</span></h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2 bg-pink-600 rounded-lg">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] text-white p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="hidden lg:block mb-8 px-2">
          <h1 className="text-xl font-extrabold tracking-tight italic text-white">WELD<span className="text-pink-600">SELLER</span></h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Management Portal</p>
        </div>
        
        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-lg border border-white/20" alt="profile" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 font-medium uppercase">{currentUser.id}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} active />
          <SidebarLink label="คลังสินค้า" icon={<Box size={18} />} onClick={() => navigate('/SellerInventory')} />
          <SidebarLink label="คำสั่งซื้อ" icon={<ClipboardList size={18} />} onClick={() => navigate('/SellerOrders')} />
        </nav>
        
        <div className="pt-4 border-t border-slate-800">
          <button onClick={() => navigate("/login")} className="flex items-center gap-3 text-slate-400 hover:text-rose-400 transition-colors text-sm font-medium w-full p-2 px-3 rounded-lg hover:bg-white/5">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* 3. Main Content */}
      <main className="flex-1 p-5 md:p-10 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashborad</h2>
            <p className="text-slate-500 text-sm mt-1">ภาพรวมระบบ</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="hidden sm:block text-right border-r border-slate-100 pr-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">สถานะร้านค้า</p>
              <p className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1.5 uppercase">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> ออนไลน์
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                <Store size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">{currentUser.shopName}</p>
                <p className="text-[11px] text-slate-500">บัญชีผู้ขายทางการ</p>
              </div>
            </div>
          </div>
        </header>

        {/* 4. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard title="รายได้เดือนนี้" value="12,450.00 บาท" growth="+15.2%" trend="up" icon={<TrendingUp size={18} />} />
          <StatCard title="ออเดอร์ใหม่" value="24 รายการ" growth="+12%" trend="up" icon={<ShoppingBag size={18} />} />
          <StatCard title="ผู้เข้าชมร้าน" value="1,205 คน" growth="-3.1%" trend="down" icon={<Users size={18} />} />
          <StatCard title="เรตติ้งเฉลี่ย" value="4.95 / 5.0" growth="ยอดเยี่ยม" trend="up" icon={<Star size={18} />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 5. Order Management */}
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle size={20} className="text-pink-600" /> งานที่ต้องจัดการ
                  </h3>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <TaskBadge label="รอจัดส่ง" count={8} color="text-pink-600" bg="bg-pink-50" />
                  <TaskBadge label="รอชำระเงิน" count={2} color="text-blue-600" bg="bg-blue-50" />
                  <TaskBadge label="รอรับคืน" count={0} color="text-slate-400" bg="bg-slate-50" />
                  <TaskBadge label="สต็อกหมด" count={3} color="text-rose-600" bg="bg-rose-50" />
               </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">คำสั่งซื้อล่าสุด</h3>
                  <button onClick={() => navigate('/SellerOrders')} className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 transition-colors">
                    ดูทั้งหมด <ArrowUpRight size={14} />
                  </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[11px] font-bold text-slate-500 border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4">เลขออเดอร์</th>
                       <th className="px-6 py-4">ลูกค้า</th>
                       <th className="px-6 py-4 text-right">ยอดชำระ</th>
                       <th className="px-6 py-4 text-center">สถานะ</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      <OrderRow id="ORD-7721" date="วันนี้, 09:15" user="คุณวิชัย กาญจนา" total="4,250.00 บาท" status="เตรียมส่ง" />
                      <OrderRow id="ORD-7718" date="วานนี้, 22:30" user="คุณมานะ ช่างเชื่อม" total="1,800.00 บาท" status="เสร็จสิ้น" />
                      <OrderRow id="ORD-7715" date="วานนี้, 15:40" user="คุณสมหญิง รักดี" total="9,500.00 บาท" status="เสร็จสิ้น" />
                   </tbody>
                 </table>
               </div>
            </section>
          </div>

          {/* 6. Product Stats */}
          <aside className="space-y-8">
            <div className="bg-[#0F172A] p-8 rounded-2xl text-white shadow-lg">
                <h3 className="text-sm font-bold mb-8 text-pink-500 flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-widest">
                  <PackageCheck size={18} /> สินค้าขายดี
                </h3>
                <div className="space-y-6">
                    <TopProductItem rank={1} name="เครื่องเชื่อม MIG 250A" sales={120} revenue="150,000 บาท" />
                    <TopProductItem rank={2} name="หน้ากากเชื่อม Auto" sales={85} revenue="25,500 บาท" />
                    <TopProductItem rank={3} name="ลวดเชื่อมเบอร์ 2" sales={300} revenue="12,000 บาท" />
                </div>
            </div>

            <div className="bg-pink-600 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Merchant Tip</p>
                <h4 className="text-lg font-bold leading-tight mb-2">เพิ่มยอดขายได้ง่ายๆ!</h4>
                <p className="text-xs opacity-90 leading-relaxed font-normal">
                  ลองเพิ่มรูปวิดีโอสาธิตการใช้งานเครื่องเชื่อมเพื่อเพิ่มความมั่นใจให้ลูกค้า
                </p>
              </div>
              <Zap size={80} className="absolute -bottom-4 -right-4 text-white/10" />
            </div>
          </aside>
        </div>
      </main>
      
      {/* Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}

// --- ส่วนประกอบย่อย (ปรับขนาด Font ให้สมดุล) ---

const StatCard = ({ title, value, growth, icon, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">{icon}</div>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {growth}
      </span>
    </div>
    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
    <h4 className="text-xl font-bold text-slate-900 tracking-tight">{value}</h4>
  </div>
);

const TaskBadge = ({ label, count, color, bg }: any) => (
  <div className={`${bg} ${color} p-5 rounded-xl text-center border border-transparent hover:border-current/10 transition-all cursor-pointer`}>
    <p className="text-[11px] font-bold uppercase tracking-tighter mb-1 opacity-70">{label}</p>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);

const OrderRow = ({ id, date, user, total, status }: any) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4">
      <p className="text-xs font-bold text-slate-800 tracking-tight">{id}</p>
      <p className="text-[10px] text-slate-400 font-medium">{date}</p>
    </td>
    <td className="px-6 py-4">
      <p className="text-xs font-semibold text-slate-700">{user}</p>
      <p className="text-[10px] text-pink-500 font-medium tracking-tight">ลูกค้าชั้นดี</p>
    </td>
    <td className="px-6 py-4 text-xs font-bold text-right text-slate-900 tracking-tight">{total}</td>
    <td className="px-6 py-4 text-center">
      <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${status === 'เสร็จสิ้น' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
        {status}
      </span>
    </td>
  </tr>
);

const TopProductItem = ({ rank, name, sales, revenue }: any) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-pink-500 text-sm border border-white/10">
      {rank}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-white truncate mb-0.5">{name}</p>
      <div className="flex justify-between items-center">
        <p className="text-[10px] text-slate-500 font-medium">{sales} ชิ้น</p>
        <p className="text-[11px] text-emerald-400 font-bold tracking-tight">{revenue}</p>
      </div>
    </div>
  </div>
);

const SidebarLink = ({ label, icon, active = false, onClick }: any) => (
  <div onClick={onClick} className={`
    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
    ${active ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}
  `}>
    <span className={active ? "text-white" : "text-pink-500/80"}>{icon}</span>
    <span className={`text-sm tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </div>
);