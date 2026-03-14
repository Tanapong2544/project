import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  LayoutDashboard, Box, ClipboardList, LogOut, Plus, Edit3, Trash2, 
  Image as ImageIcon, Search, Menu, X, User, Package, AlertCircle,
  Filter, ArrowUpDown
} from "lucide-react";

// --- Interfaces ---
interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  status: string;
  price: number;
  category: string;
  image: string | null;
  seller: {
    firstName: string;
    lastName: string;
  };
}


// --- Component: สถานะสต็อก (Inventory Badge - ปรับให้ดูทางการขึ้น) ---
const InventoryBadge: React.FC<{ stock: number }> = ({ stock }) => {
  let config = {
    label: "พร้อมจำหน่าย",
    style: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Icon: Package
  };

  if (stock <= 0) {
    config = { label: "สินค้าหมด", style: "bg-rose-50 text-rose-600 border-rose-100", Icon: X };
  } else if (stock <= 5) {
    config = { label: "สต็อกต่ำ", style: "bg-amber-50 text-amber-600 border-amber-100", Icon: AlertCircle };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-tight ${config.style}`}>
      <config.Icon size={12} />
      {config.label}: {stock}
    </span>
  );
};

export default function SellerInventory() {
  const navigate = useNavigate();
  
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form States
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: "",
    price: "",
    category: "",
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://localhost:5000/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      if (res.data.length > 0) {
        setUserProfile({
          firstName: res.data[0].seller.firstName,
          lastName: res.data[0].seller.lastName,
        });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("stock", formData.stock);
    data.append("price", formData.price);
    data.append("category", formData.category);
    if (file) data.append("image", file);

    try {
      const token = localStorage.getItem("access_token");
      await axios.post("http://localhost:5000/products", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      Swal.fire({ 
        icon: "success", 
        title: "เพิ่มสินค้าสำเร็จ", 
        confirmButtonColor: "#DB2777",
        customClass: { title: 'font-sans font-bold', htmlContainer: 'font-sans' }
      });
      setIsModalOpen(false); setFile(null); setPreview(null);
      fetchProducts();
    } catch (error) {
      Swal.fire("ผิดพลาด", "กรุณาตรวจสอบข้อมูลอีกครั้ง", "error");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: `ต้องการลบรายการ "${name}" ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก"
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://localhost:5000/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (error) {
        Swal.fire("Error", "ไม่สามารถลบข้อมูลได้", "error");
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-[#1E293B]"
         style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      
      {/* 1. Mobile Header */}
      <div className="lg:hidden bg-[#0F172A] p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-white font-bold tracking-tight text-lg uppercase italic">Weld<span className="text-pink-600">Seller</span></h1>
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
          <h1 className="text-xl font-extrabold tracking-tight italic">WELD<span className="text-pink-600">SELLER</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white shadow-lg">
            {userProfile?.firstName[0] || <User size={18} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">{userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "กำลังโหลด..."}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink label="ภาพรวมระบบ" icon={<LayoutDashboard size={18} />} onClick={() => navigate("/SellerDashboard")} />
          <SidebarLink label="คลังสินค้า" icon={<Box size={18} />} active />
          <SidebarLink label="คำสั่งซื้อ" icon={<ClipboardList size={18} />} onClick={() => navigate("/SellerOrders")} />
        </nav>

        <div className="pt-4 border-t border-slate-800">
          <button onClick={() => { localStorage.removeItem("access_token"); navigate("/login"); }} 
            className="flex items-center gap-3 text-slate-400 hover:text-rose-400 text-sm font-medium w-full p-2.5 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* 3. Main Content */}
      <main className="flex-1 p-5 md:p-10 lg:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">คลังสินค้า</h2>
            <p className="text-slate-500 text-sm mt-1">จัดการรายการสินค้า ตรวจสอบสต็อก และราคาจำหน่าย</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} 
            className="w-full sm:w-auto bg-pink-600 text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all flex items-center justify-center gap-2 active:scale-95">
            <Plus size={18} /> เพิ่มสินค้าใหม่
          </button>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อสินค้า หรือหมวดหมู่..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500 outline-none transition-all" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} /> ตัวกรอง
          </button>
        </div>

        {/* Product Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[11px] font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5 text-center">รูปภาพ</th>
                  <th className="px-8 py-5">รายละเอียดสินค้า</th>
                  <th className="px-8 py-5 text-right">ราคา (บาท)</th>
                  <th className="px-8 py-5 text-center">สถานะสต็อก</th>
                  <th className="px-8 py-5 text-right">เครื่องมือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length > 0 ? filteredProducts.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4 w-32">
                      <div className="w-16 h-16 mx-auto rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm">
                        {item.image ? (
                          <img src={`http://localhost:5000/uploads/products/${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 min-w-[250px]">
                      <p className="text-sm font-bold text-slate-800 mb-1">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium italic truncate max-w-[150px]">
                          {item.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <p className="text-sm font-bold text-slate-900 tracking-tight">
                        {Number(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </p>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <InventoryBadge stock={item.stock} />
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="แก้ไข"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="ลบ"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <Box size={40} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">ไม่พบรายการสินค้า</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal: เพิ่มสินค้า (ปรับปรุงดีไซน์ให้ทางการขึ้น) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">เพิ่มรายการสินค้าใหม่</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="group relative h-48 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center transition-all hover:bg-slate-100 hover:border-pink-300 cursor-pointer overflow-hidden">
                {preview ? <img src={preview} className="absolute inset-0 w-full h-full object-cover" /> : 
                  <div className="text-center">
                    <ImageIcon size={32} className="mx-auto text-slate-300 mb-2 group-hover:text-pink-400 transition-colors" />
                    <p className="text-xs font-bold text-slate-400 uppercase">อัปโหลดรูปภาพสินค้า</p>
                  </div>
                }
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">ชื่อสินค้า</label>
                  <input type="text" placeholder="ระบุชื่อสินค้า..." required className="res-input" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">ราคา (บาท)</label>
                    <input type="number" step="0.01" placeholder="0.00" className="res-input" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">จำนวนในสต็อก</label>
                    <input type="number" placeholder="0" className="res-input" onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">หมวดหมู่</label>
                  <select className="res-input appearance-none bg-no-repeat bg-[right_1rem_center]" required onChange={(e) => setFormData({ ...formData, category: e.target.value })} defaultValue="">
                    <option value="" disabled>เลือกหมวดหมู่...</option>
                    <option value="เครื่องมือช่าง">เครื่องมือช่าง</option>
                    <option value="เครื่องเชื่อม">เครื่องเชื่อม</option>
                    <option value="อุปกรณ์เซฟตี้">อุปกรณ์เซฟตี้</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">รายละเอียดสินค้า</label>
                  <textarea placeholder="ระบุรายละเอียดเพิ่มเติม..." rows={3} className="res-input resize-none" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-pink-600 transition-all shadow-lg active:scale-95 mt-2">
                บันทึกสินค้าเข้าคลัง
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tailwind Custom Class Style (Updated for Balanced UI) */}
      <style>{`
        .res-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: #FFFFFF;
          border-radius: 0.75rem;
          border: 1px solid #E2E8F0;
          outline: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .res-input:focus { 
          border-color: #DB2777; 
          box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1);
        }
        .res-input::placeholder { color: #94A3B8; font-weight: 400; }
      `}</style>
    </div>
  );
}

// SidebarLink Helper (Matching Dashboard Style)
const SidebarLink: React.FC<{ label: string; icon: React.ReactNode; active?: boolean; onClick?: () => void }> = ({ label, icon, active = false, onClick }) => (
  <div onClick={onClick} className={`
    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
    ${active ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}
  `}>
    <span className={active ? "text-white" : "text-pink-500/80"}>{icon}</span>
    <span className={`text-sm tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </div>
);