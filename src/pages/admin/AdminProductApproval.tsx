import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- 1. Interfaces ---
interface PendingProduct {
  id: string;
  sellerName: string; // ชื่อผู้ลงขาย
  sellerId: string;   // รหัสผู้ลงขาย
  productName: string;
  price: number;
  category: string;
  image: string;
  
}

export default function AdminProductApproval() {
  const navigate = useNavigate();

  // Mock Data: รายการสินค้าที่รออนุมัติ (เน้นชื่อผู้ลงขาย)
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([
    {
      id: "PRD-TEMP-001",
      sellerName: "สถาพร มั่นคง",
      sellerId: "SL-7721",
      productName: "เครื่องเชื่อม MIG 200A Pro",
      price: 15500,
      category: "เครื่องเชื่อม",
      image: "",
     
    },
    {
      id: "PRD-TEMP-002",
      sellerName: "สมหมาย รักงาน",
      sellerId: "SL-8842",
      productName: "ถุงมือหนังกันสะเก็ดไฟ",
      price: 450,
      category: "อุปกรณ์เซฟตี้",
      image: "",
    
    }
  ]);

  const handleApprove = (id: string) => {
    setPendingProducts(prev => prev.filter(p => p.id !== id));
    alert("อนุมัติสินค้าและเปิดการมองเห็นเรียบร้อย!");
  };

  const handleReject = (id: string) => {
    const reason = prompt("ระบุเหตุผลที่ปฏิเสธเพื่อแจ้งไปยังผู้ลงขาย:");
    if (reason) {
      setPendingProducts(prev => prev.filter(p => p.id !== id));
      alert("ส่งเรื่องปฏิเสธเรียบร้อย");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar - WELDADMIN */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate("/admindashboard")}>
          <h1 className="text-xl font-black tracking-tighter italic">WELD<span className="text-[#FF85A2]">ADMIN</span></h1>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarItem label="ภาพรวมระบบ" icon="📊" onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon="💳" onClick={() => navigate("/adminverification")} />
          <SidebarItem label="อนุมัติสินค้า" icon="📦" active badge={pendingProducts.length} />
          <SidebarItem label="รายชื่อผู้ใช้" icon="👥" onClick={() => navigate("/adminusers")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Product Approval</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">ตรวจสอบความถูกต้องของสินค้าตามรายชื่อผู้ลงขาย</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {pendingProducts.map((product) => (
            <div key={product.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-md transition-all">
              
              {/* รูปสินค้า */}
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-slate-50 flex-shrink-0 shadow-inner">
                <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
              </div>

              {/* ข้อมูลผู้ลงขายและสินค้า */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#0F172A] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    ผู้ลงขาย: {product.sellerName}
                  </span>
                  <span className="text-slate-300 text-[10px] font-bold uppercase tracking-tighter">ID: {product.sellerId}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-[#0F172A] leading-tight">{product.productName}</h3>
                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase italic tracking-tighter">{product.category}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ราคาเสนอขาย</span>
                    <span className="text-lg font-black text-[#FF85A2]">฿{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ปุ่มอนุมัติ / ปฏิเสธ */}
              <div className="flex flex-col gap-2 w-full md:w-48">
                <button 
                  onClick={() => handleApprove(product.id)}
                  className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-600 transition-all shadow-lg shadow-slate-100 active:scale-95"
                >
                  อนุมัติขาย
                </button>
                <button 
                  onClick={() => handleReject(product.id)}
                  className="w-full py-3 text-slate-400 hover:text-red-500 font-black text-[9px] uppercase tracking-widest transition-colors"
                >
                  ปฏิเสธรายการ
                </button>
              </div>
            </div>
          ))}

          {pendingProducts.length === 0 && (
            <div className="bg-white p-20 rounded-[2.5rem] text-center border-2 border-dashed border-slate-100">
               <p className="text-slate-300 font-black uppercase tracking-widest">ไม่มีรายการรอตรวจสอบ</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sub-component สำหรับ Sidebar
function SidebarItem({ label, icon, active = false, badge = 0, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${active ? "bg-[#FF85A2] text-white shadow-lg" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {badge > 0 && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? "bg-white text-[#FF85A2]" : "bg-[#FF85A2] text-white"}`}>{badge}</span>}
    </div>
  );
}