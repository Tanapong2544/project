import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Box, 
  ClipboardList, 
  LogOut, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";

// --- 1. Interfaces ---
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
  growth: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

export default function SellerDashboard() {
  const navigate = useNavigate();

  const currentUser: CurrentUser = {
    name: "นายเอ สวัสดี",
    shopName: "WeldMaster Thailand",
    avatar: "https://ui-avatars.com/api/?name=น&background=FF85A2&color=fff",
    role: "Seller",
    id: "ID: 1"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate('/SellerDashboard')}>
          <h1 className="text-xl font-black tracking-tighter italic">WELD<span className="text-[#FF85A2]">SELLER</span></h1>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">E-Commerce System</p>
        </div>
        
        <div className="mb-8 px-2 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
            <img src={currentUser.avatar} className="w-10 h-10 rounded-xl" alt="profile" />
            <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{currentUser.name}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.id}</p>
            </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} active />
          <SidebarLink label="จัดการสินค้า" icon={<Box size={18} />} onClick={() => navigate('/SellerInventory')} />
          <SidebarLink label="คำสั่งซื้อ" icon={<ClipboardList size={18} />} onClick={() => navigate('/SellerOrders')} />
        </nav>
        
        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-black w-full p-3 rounded-xl hover:bg-white/5"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="h-1 w-8 bg-[#FF85A2] rounded-full"></span>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Store Overview</p>
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Dashboard</h2>
          </div>
          
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 px-4">
             <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">สถานะร้านค้า</p>
                <p className="text-xs font-black text-emerald-500 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                </p>
             </div>
             <div className="w-[1px] h-8 bg-slate-100"></div>
             <p className="text-sm font-black">{currentUser.shopName}</p>
          </div>
        </header>

        {/* 1. Key Performance Indicators (Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="รายได้สุทธิเดือนนี้" value="12,000" growth="+12.5%" icon={<TrendingUp className="text-emerald-500" />} trend="up" />
          <StatCard title="คำสั่งซื้อทั้งหมด" value="20" growth="+8%" icon={<ShoppingBag className="text-blue-500" />} trend="up" />
          <StatCard title="ผู้เข้าชมร้านค้า" value="50" growth="-2.4%" icon={<Users className="text-indigo-500" />} trend="down" />
          <StatCard title="คะแนนร้านค้า" value="4.9" growth="คงที่" icon={<Star className="text-amber-500" />} trend="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Order Management & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-tighter flex items-center gap-2">
                    <AlertCircle size={18} className="text-[#FF85A2]" /> สิ่งที่ต้องจัดการ (Tasks)
                  </h3>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TaskBadge label="รอจัดส่ง" count={3} color="text-amber-600" bg="bg-amber-50" />
                  <TaskBadge label="รอชำระเงิน" count={1} color="text-blue-600" bg="bg-blue-50" />
                  <TaskBadge label="คืนสินค้า" count={0} color="text-slate-400" bg="bg-slate-50" />
                  <TaskBadge label="สต็อกหมด" count={5} color="text-red-600" bg="bg-red-50" />
               </div>
            </section>

            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-tighter">รายการสั่งซื้อล่าสุด</h3>
                  <button onClick={() => navigate('/SellerOrders')} className="text-[10px] font-black text-[#FF85A2] uppercase flex items-center gap-1 hover:gap-2 transition-all">
                    ดูประวัติทั้งหมด <ArrowUpRight size={14} />
                  </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[9px] uppercase font-black text-slate-400">
                     <tr>
                       <th className="px-8 py-4">ID / วันที่</th>
                       <th className="px-8 py-4">ลูกค้า</th>
                       <th className="px-8 py-4 text-right">ยอดชำระ</th>
                       <th className="px-8 py-4 text-center">สถานะ</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      <OrderRow id="ORD-9901" date="วันนี้, 10:20" user="สมชาย สายเชื่อม" total="3,000" status="Processing" />
                      <OrderRow id="ORD-9895" date="วานนี้, 14:45" user="วิชัย งานดี" total="2,400" status="Shipped" />
                      <OrderRow id="ORD-9892" date="8 มี.ค., 09:12" user="เกรียงไกร การช่าง" total="850" status="Delivered" />
                   </tbody>
                 </table>
               </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
                <h3 className="text-sm font-black mb-8 uppercase tracking-widest text-[#FF85A2]">สินค้าขายดี (Top Sales)</h3>
                <div className="space-y-6">
                    <TopProductItem rank={1} name="เครื่องเชื่อม MIG 200A" sales={45} revenue="25,000 บาท" />
                    <TopProductItem rank={2} name="หน้ากากเชื่อม Auto-Darkening" sales={32} revenue="10,000 บาท" />
                    <TopProductItem rank={3} name="ลวดเชื่อมสแตนเลส 308L" sales={18} revenue="5,000 บาท" />
                </div>
            </div>

            <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Seller Tip</p>
                    <h4 className="text-lg font-black mb-2 italic">เพิ่มยอดขาย 20%!</h4>
                    <p className="text-xs text-emerald-50 leading-relaxed opacity-90">ลองใช้ฟีเจอร์ "โปรโมชั่นส่งฟรี" สำหรับคำสั่งซื้อที่เกิน ฿5,000 เพื่อกระตุ้นการตัดสินใจของลูกค้า</p>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:scale-110 transition-transform">
                    <TrendingUp size={120} />
                </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon, trend }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {growth}
      </span>
    </div>
    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{title}</p>
    <h4 className="text-2xl font-black text-[#0F172A]">{value}</h4>
  </div>
);

const TaskBadge: React.FC<{ label: string; count: number; color: string; bg: string }> = ({ label, count, color, bg }) => (
  <div className={`${bg} p-4 rounded-3xl border border-white/50 text-center cursor-pointer hover:shadow-inner transition-all`}>
    <p className={`text-[10px] font-black uppercase mb-1 ${color}`}>{label}</p>
    <p className={`text-xl font-black ${color}`}>{count}</p>
  </div>
);

const OrderRow: React.FC<{ id: string; date: string; user: string; total: string; status: string }> = ({ id, date, user, total, status }) => {
  const getStatusStyle = (s: string) => {
    switch(s) {
      case "Processing": return "bg-amber-100 text-amber-600";
      case "Shipped": return "bg-blue-100 text-blue-600";
      case "Delivered": return "bg-emerald-100 text-emerald-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition group cursor-pointer">
      <td className="px-8 py-5">
        <p className="text-[10px] font-black text-[#0F172A]">{id}</p>
        <p className="text-[9px] text-slate-400 font-bold uppercase">{date}</p>
      </td>
      <td className="px-8 py-5 text-xs font-bold text-slate-600">{user}</td>
      <td className="px-8 py-5 text-xs font-black text-right">฿{total}</td>
      <td className="px-8 py-5 text-center">
        <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl ${getStatusStyle(status)}`}>
          {status}
        </span>
      </td>
    </tr>
  );
};

const TopProductItem: React.FC<{ rank: number; name: string; sales: number; revenue: string }> = ({ rank, name, sales, revenue }) => (
  <div className="flex items-center gap-4 group cursor-default">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[#FF85A2] italic border border-white/10">
        0{rank}
    </div>
    <div className="flex-1">
      <p className="text-xs font-black text-white line-clamp-1 group-hover:text-[#FF85A2] transition-colors">{name}</p>
      <div className="flex justify-between items-center mt-1">
        <p className="text-[9px] text-slate-500 font-bold uppercase">ยอดขาย {sales} ชิ้น</p>
        <p className="text-[9px] text-emerald-400 font-black">{revenue}</p>
      </div>
    </div>
  </div>
);

const SidebarLink: React.FC<{ label: string; icon: React.ReactNode; active?: boolean; onClick?: () => void }> = ({ label, icon, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-[#FF85A2] text-white shadow-lg shadow-pink-500/20 font-black' : 'text-slate-400 hover:text-white hover:bg-white/5 font-bold'
    }`}
  >
    <span>{icon}</span>
    <span className="text-sm">{label}</span>
  </div>
);