import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- 1. Define Interfaces (กำหนด Type เพื่อแก้ตัวแดง) ---

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: string;
  status: "มีสินค้า" | "ใกล้หมด" | "สินค้าหมด";
}

interface SidebarLinkProps {
  label: string;
  icon: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

interface InventoryBadgeProps {
  status: Product["status"];
}

// --- 2. Sub-components ---

const InventoryBadge: React.FC<InventoryBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    "มีสินค้า": "bg-green-50 text-green-600 border-green-100",
    "ใกล้หมด": "bg-amber-50 text-amber-600 border-amber-100",
    "สินค้าหมด": "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ label, icon, active = false, badge = 0, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
        active ? 'bg-[#FF85A2] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-white text-[#FF85A2] text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

// --- 3. Main Component ---

export default function SellerInventory() {
  const navigate = useNavigate();

  // กำหนด Type ให้กับ State ของ Products
  const [products] = useState<Product[]>([
    { id: "WD-101", name: "เครื่องเชื่อม MIG 200A Professional", stock: 12, price: 15500, category: "เครื่องเชื่อม", status: "มีสินค้า" },
    { id: "WD-102", name: "หน้ากากเชื่อมปรับแสงอัตโนมัติ", stock: 4, price: 1200, category: "อุปกรณ์เซฟตี้", status: "ใกล้หมด" },
    { id: "WD-103", name: "ลวดเชื่อมสแตนเลส 308L 2.0mm", stock: 0, price: 850, category: "วัสดุสิ้นเปลือง", status: "สินค้าหมด" },
  ]);

  const currentUser = {
    name: "สถาพร มั่นคง",
    id: "SL-7721",
    avatar: "https://ui-avatars.com/api/?name=Sathaporn+Mankong&background=0F172A&color=fff"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate('/SellerDashboard')}>
          <h1 className="text-xl font-black tracking-tighter italic">WELD<span className="text-[#FF85A2]">SELLER</span></h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Seller Account</p>
        </div>

        <div className="mb-8 px-2 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-xl" alt="profile" />
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate">{currentUser.name}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.id}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink label="ภาพรวมระบบ" icon="📊" onClick={() => navigate('/SellerDashboard')} />
          <SidebarLink label="จัดการสินค้า" icon="📦" active />
          <SidebarLink label="คำสั่งซื้อ" icon="📑" onClick={() => navigate('/SellerOrders')} />
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

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Inventory</h2>
            <p className="text-slate-400 text-sm font-medium">จัดการสต็อกและรายการสินค้าทั้งหมดของคุณ</p>
          </div>
          <button 
            className="bg-[#FF85A2] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-pink-100 hover:bg-[#0F172A] transition-all"
            onClick={() => navigate('/selleraddproduct')}
          >
            + เพิ่มสินค้าใหม่
          </button>
        </header>

        {/* ตารางสินค้า */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
             <div className="relative flex-1 max-w-md">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อสินค้า" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
             </div>
             <select className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-500 outline-none cursor-pointer">
                <option>ทุกหมวดหมู่</option>
                <option>เครื่องเชื่อม</option>
                <option>อุปกรณ์เซฟตี้</option>
             </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">รายละเอียดสินค้า</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">หมวดหมู่</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">ราคา</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest">สต็อก</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-400 tracking-widest text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black group-hover:text-[#FF85A2] transition-colors">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.id}</p>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{item.category}</td>
                    <td className="px-8 py-6 text-sm font-black">฿{item.price.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold">{item.stock} ชิ้น</span>
                        <InventoryBadge status={item.status} />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all mr-2">📝</button>
                        <button className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-all">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}