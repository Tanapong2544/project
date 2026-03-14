import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  LayoutDashboard, CreditCard, Package, Users, 
  LogOut, CheckCircle2, XCircle, Store, 
  Tag, ChevronRight, PackageSearch, Menu, 
  X, ShieldCheck
} from "lucide-react";

// --- Interfaces ---
interface PendingProduct {
  id: string;
  sellerName: string;
  sellerId: string;
  productName: string;
  price: number;
  category: string;
  image: string;
}

export default function AdminProductApproval() {
  const navigate = useNavigate();
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://localhost:5000/products/admin/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.map((item: any) => ({
        id: item.id.toString(),
        sellerName: `${item.seller.firstName} ${item.seller.lastName}`,
        sellerId: item.seller.id.toString(),
        productName: item.name,
        price: Number(item.price),
        category: item.category,
        image: `http://localhost:5000/uploads/products/${item.image}`,
      }));
      setPendingProducts(formatted);
    } catch (error) {
      console.error("Error fetching pending products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingProducts(); }, []);

  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการอนุมัติ?",
      text: "สินค้าจะถูกแสดงบนหน้าร้านค้าออนไลน์ทันที",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#BE185D",
      cancelButtonColor: "#64748B",
      confirmButtonText: "อนุมัติขาย",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.patch(`http://localhost:5000/products/admin/${id}/approve`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({ icon: "success", title: "อนุมัติสำเร็จ!", showConfirmButton: false, timer: 1500 });
        fetchPendingProducts();
      } catch (error) {
        Swal.fire("ผิดพลาด", "ไม่สามารถดำเนินการได้", "error");
      }
    }
  };

  const handleReject = async (id: string) => {
    const result = await Swal.fire({
      title: "ปฏิเสธรายการ?",
      text: "รายการนี้จะถูกตีกลับหรือลบออกจากคิวการตรวจสอบ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E11D48",
      cancelButtonColor: "#64748B",
      confirmButtonText: "ยืนยันการปฏิเสธ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.patch(`http://localhost:5000/products/admin/${id}/reject`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("ดำเนินการแล้ว", "ปฏิเสธรายการเรียบร้อย", "success");
        fetchPendingProducts();
      } catch (error) {
        Swal.fire("ผิดพลาด", "ไม่สามารถดำเนินการได้", "error");
      }
    }
  };

  return (
    // 1. ล็อคโครงสร้างหน้าจอด้วย h-screen และ overflow-hidden
    <div className="h-screen w-full bg-[#F1F5F9] flex overflow-hidden font-sans text-slate-900">
      
      {/* 2. Sidebar - ล็อคความกว้าง flex-shrink-0 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white flex flex-col p-6 
        transition-transform duration-300 lg:relative lg:translate-x-0 
        flex-shrink-0 border-r border-white/5
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center gap-3 mb-10 px-2 flex-shrink-0">
          <div className="w-9 h-9 bg-[#BE185D] rounded-xl flex items-center justify-center font-black shadow-lg shadow-pink-900/40 text-white">W</div>
          <h1 className="text-2xl font-bold uppercase tracking-tight italic">WELD<span className="text-[#0EA5E9]">PRO</span></h1>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          <SidebarItem label="ภาพรวมระบบ" icon={<LayoutDashboard size={20} />} onClick={() => navigate("/admindashboard")} />
          <SidebarItem label="ตรวจสอบสลิป" icon={<CreditCard size={20} />} onClick={() => navigate("/adminverification")} />
          <SidebarItem label="อนุมัติสินค้า" icon={<Package size={20} />} active badge={pendingProducts.length} />
          <SidebarItem label="จัดการผู้ใช้งาน" icon={<Users size={20} />} onClick={() => navigate("/adminusers")} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 flex-shrink-0">
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} 
                  className="flex items-center gap-3 w-full p-4 text-slate-400 hover:text-[#BE185D] transition-all font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/5">
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* 3. Main Content - แยก Scroll ของตัวเอง */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] relative overflow-hidden">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white flex-shrink-0 shadow-lg">
          <h1 className="font-bold italic">WELDPRO</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/10 rounded-lg">
            <Menu size={20} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Page Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#BE185D]/10 rounded-lg">
                    <PackageSearch className="text-[#BE185D]" size={28} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">อนุมัติสินค้า</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium">ตรวจสอบความถูกต้องและคุณภาพของสินค้าจากผู้ขาย</p>
              </div>

              <div className="bg-white border border-slate-200 px-8 py-5 rounded-[2rem] shadow-sm flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">รออนุมัติ</p>
                  <p className="text-3xl font-black text-[#BE185D] leading-none mt-1">{pendingProducts.length}</p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-2.5 rounded-full border border-slate-100">
                   <ShieldCheck size={14} className="text-[#0EA5E9]" /> System Authorized
                </div>
              </div>
            </header>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-8">
              {loading ? (
                 <div className="py-32 text-center font-bold text-[#0EA5E9] animate-pulse italic tracking-widest">FETCHING DATA FROM SERVER...</div>
              ) : pendingProducts.length > 0 ? (
                pendingProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col lg:flex-row hover:border-[#0EA5E9]/30 transition-all duration-500 group">
                    
                    {/* Image Section */}
                    <div className="lg:w-72 h-72 lg:h-auto bg-slate-50 flex-shrink-0 relative overflow-hidden border-r border-slate-50">
                      <img src={product.image} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 uppercase">New Entry</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-8 lg:p-10 flex flex-col">
                      <div className="flex-1 space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-[#0EA5E9]/10 text-[#0EA5E9] text-[10px] font-black px-4 py-2 rounded-xl border border-[#0EA5E9]/10 flex items-center gap-2 uppercase tracking-wider">
                            <Store size={14} /> {product.sellerName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-lg italic">ID: {product.sellerId}</span>
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-800 leading-tight tracking-tight group-hover:text-pink-600 transition-colors">{product.productName}</h3>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 font-bold border border-slate-100 text-xs">
                            <Tag size={14} className="text-[#0EA5E9]" />
                            {product.category}
                          </div>
                        </div>

                        <div className="pt-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">ราคาตั้งขาย</p>
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">
                            {product.price.toLocaleString()} <span className="text-lg font-bold text-slate-400 ml-1">บาท</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Area */}
                      <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => handleApprove(product.id)}
                          className="flex-1 flex items-center justify-center gap-3 bg-[#0F172A] text-white py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#BE185D] transition-all shadow-lg active:scale-95"
                        >
                          <CheckCircle2 size={18} /> อนุมัติการขาย
                        </button>
                        <button 
                          onClick={() => handleReject(product.id)}
                          className="flex-1 flex items-center justify-center gap-3 bg-white text-slate-400 border border-slate-200 py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
                        >
                          <XCircle size={18} /> ปฏิเสธรายการ
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white py-32 rounded-[3.5rem] text-center border-2 border-dashed border-slate-200">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6 transform rotate-12">
                    <PackageSearch size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Queue Clear</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">ไม่พบสินค้าที่รอดำเนินการในขณะนี้</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Mobile Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-[#0F172A]/80 z-40 lg:hidden backdrop-blur-md transition-opacity" onClick={() => setSidebarOpen(false)} />
        )}
      </main>
    </div>
  );
}

// --- Sub Component: SidebarItem (ล็อคขนาดป้องกันการขยับ) ---
function SidebarItem({ label, icon, active = false, badge = 0, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300
        border border-transparent /* ล็อคขนาด */
        ${active 
          ? "bg-[#BE185D] text-white shadow-xl shadow-pink-900/40" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <div className="flex items-center gap-4">
        <span className={active ? "text-white" : "text-slate-500 group-hover:text-[#0EA5E9]"}>{icon}</span>
        <span className="text-sm font-black uppercase tracking-tight">{label}</span>
      </div>
      {badge > 0 && (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg animate-bounce ${active ? "bg-white text-[#BE185D]" : "bg-[#BE185D] text-white"}`}>
          {badge}
        </span>
      )}
      {!badge && active && <ChevronRight size={16} />}
    </button>
  );
}