import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  LogOut,
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Package,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

interface Seller {
  firstName: string;
  lastName: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  category: string;
  image: string | null;
  sellerId: number;
  seller: Seller;
}

interface SidebarLinkProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

const InventoryBadge: React.FC<{ stock: number }> = ({ stock }) => {
  let label = "In Stock";
  let style = "bg-emerald-50 text-emerald-600 border-emerald-100";

  if (stock <= 0) {
    label = "Out of Stock";
    style = "bg-red-50 text-red-600 border-red-100";
  } else if (stock <= 5) {
    label = "Low Stock";
    style = "bg-amber-50 text-amber-600 border-amber-100";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${style}`}
    >
      {label}: {stock}
    </span>
  );
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  label,
  icon,
  active = false,
  badge = 0,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
      active
        ? "bg-[#FF85A2] text-white shadow-lg shadow-pink-500/20"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`}
  >
    <div className="flex items-center gap-3">
      <span
        className={
          active ? "text-white" : "text-slate-500 group-hover:text-white"
        }
      >
        {icon}
      </span>
      <span className="text-sm font-bold">{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-white text-[#FF85A2] text-[10px] font-black px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

export default function SellerInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    } catch (error) {
      console.error("Error fetching products", error);
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
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "เพิ่มสินค้าเข้าสต็อกเรียบร้อยแล้ว",
        confirmButtonColor: "#0F172A",
      });
      setIsModalOpen(false);
      setFile(null);
      setPreview(null);
      fetchProducts();
    } catch (error: any) {
      Swal.fire(
        "ผิดพลาด",
        error.response?.data?.message || "ไม่สามารถเพิ่มสินค้าได้",
        "error",
      );
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบสินค้า",
      text: `คุณต้องการลบสินค้า ${name} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://localhost:5000/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "ลบข้อมูลสินค้าเรียบร้อย", "success");
        fetchProducts();
      } catch (error) {
        Swal.fire("Error", "ไม่สามารถลบสินค้าได้", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl">
        <div
          className="mb-10 px-2 cursor-pointer"
          onClick={() => navigate("/SellerDashboard")}
        >
          <h1 className="text-xl font-black tracking-tighter italic">
            WELD<span className="text-[#FF85A2]">SELLER</span>
          </h1>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
            Inventory Management
          </p>
        </div>

        <div className="mb-8 px-2 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-[#FF85A2] flex items-center justify-center font-black text-white text-sm shadow-inner">
            {products.length > 0
              ? products[0].seller.firstName[0].toUpperCase()
              : "S"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate">
              {products.length > 0
                ? `${products[0].seller.firstName} ${products[0].seller.lastName}`
                : "Loading..."}
            </p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              {products.length > 0 ? `ID: ${products[0].sellerId}` : "ID: ---"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink
            label="ภาพรวมระบบ"
            icon={<LayoutDashboard size={18} />}
            onClick={() => navigate("/SellerDashboard")}
          />
          <SidebarLink label="จัดการสินค้า" icon={<Box size={18} />} active />
          <SidebarLink
            label="คำสั่งซื้อ"
            icon={<ClipboardList size={18} />}
            onClick={() => navigate("/SellerOrders")}
          />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-black w-full p-2"
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-8 bg-[#FF85A2] rounded-full"></span>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Stock Management
              </p>
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Inventory
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#FF85A2] transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> เพิ่มสินค้าใหม่
          </button>
        </header>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl relative animate-in zoom-in duration-200">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-[#0F172A]">
                  เพิ่มรายการสินค้า
                </h3>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
                  Register New Product Entry
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-4 bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative overflow-hidden h-48 group">
                  {preview ? (
                    <img
                      src={preview}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="preview"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-300 group-hover:text-[#FF85A2] transition-colors">
                        <ImageIcon size={24} />
                      </div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        อัปโหลดรูปภาพสินค้า
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ระบุชื่อสินค้า"
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#FF85A2]/20 focus:bg-white text-sm font-bold transition-all"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="relative">
                    <textarea
                      placeholder="ระบุรายละเอียดสินค้า"
                      required
                      rows={4}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#FF85A2]/20 focus:bg-white text-sm font-bold transition-all resize-none shadow-sm"
                      onChange={(e) =>
                        setFormData({...formData,description: e.target.value,})
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="ราคา"
                        required
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#FF85A2]/20 focus:bg-white text-sm font-bold transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="จำนวนสต็อก"
                        required
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#FF85A2]/20 focus:bg-white text-sm font-bold transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#FF85A2]/20 focus:bg-white text-sm font-bold text-slate-600 appearance-none transition-all"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        เลือกหมวดหมู่สินค้า
                      </option>
                      <option value="เครื่องมือช่าง">
                        เครื่องมือช่าง (Mechanical Tools)
                      </option>
                      <option value="เครื่องเชื่อม">
                        เครื่องเชื่อม (Welding Machines)
                      </option>
                      <option value="อุปกรณ์เซฟตี้">
                        อุปกรณ์เซฟตี้ (Safety Gears)
                      </option>
                      <option value="วัสดุสิ้นเปลือง">
                        วัสดุสิ้นเปลือง (Consumables)
                      </option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition"
                  >
                    ยกเลิกการเพิ่ม
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-[#0F172A] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-[#FF85A2] transition-all active:scale-95"
                  >
                    บันทึกข้อมูลเสร็จสิ้น
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[9px] uppercase font-black text-slate-400 tracking-widest">
                    Product Details
                  </th>
                  <th className="px-8 py-6 text-[9px] uppercase font-black text-slate-400 tracking-widest">
                    Category
                  </th>
                  <th className="px-8 py-6 text-[9px] uppercase font-black text-slate-400 tracking-widest">
                    Unit Price
                  </th>
                  <th className="px-8 py-6 text-[9px] uppercase font-black text-slate-400 tracking-widest">
                    Inventory Status
                  </th>
                  <th className="px-8 py-6 text-[9px] uppercase font-black text-slate-400 tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-24">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-[#FF85A2] rounded-full animate-spin"></div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          Synchronizing Database...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-24 text-slate-300"
                    >
                      <Package size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold">
                        ไม่พบข้อมูลสินค้าในคลังของคุณ
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            {item.image ? (
                              <img
                                src={`http://localhost:5000/uploads/products/${item.image}`}
                                className="w-full h-full object-cover"
                                alt="product"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-200">
                                <Package size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#0F172A] group-hover:text-[#FF85A2] transition-colors line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                              ID: {item.id.toString().padStart(2, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-[#0F172A]">
                          {Number(item.price).toLocaleString()} บาท
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <InventoryBadge stock={item.stock} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => console.log("Edit:", item.id)}
                            className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="ลบสินค้า"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
