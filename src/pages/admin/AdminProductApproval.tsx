import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import {
  LayoutDashboard,
  CreditCard,
  Package,
  Users,
  LogOut,
  CheckCircle2,
  XCircle,
  Store,
  Tag,
  ChevronRight,
  PackageSearch,
} from "lucide-react";

interface PendingProduct {
  id: string;
  sellerName: string;
  sellerId: string;
  productName: string;
  price: number;
  category: string;
  image: string;
  sellerType: "verified" | "general";
}

export default function AdminProductApproval() {
  const navigate = useNavigate();
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "http://localhost:5000/products/admin/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // แก้ไขตรงนี้: เช็คว่า res.data เป็น array หรือไม่
      // หาก API ส่งเป็น Object ที่เก็บอาเรย์ไว้ข้างใน ให้ระบุ property นั้น เช่น res.data.data
      const rawData = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      const formatted = rawData.map((item: any) => ({
        id: item.id.toString(),
        sellerName: `${item.seller.firstName} ${item.seller.lastName}`,
        sellerId: item.seller.id.toString(),
        productName: item.name,
        price: Number(item.price),
        category: item.category,
        image: `http://localhost:5000/uploads/products/${item.image}`,
        sellerType: "general",
      }));
      setPendingProducts(formatted);
    } catch (error) {
      console.error("Error fetching pending products", error);
      setPendingProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการอนุมัติสินค้า",
      text: "คุณต้องการอนุมัติสินค้าชิ้นนี้ใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: "อนุมัติ",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.patch(
          `http://localhost:5000/products/admin/${id}/approve`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        Swal.fire("สำเร็จ!", "รายการถูกอนุมัติเรียบร้อยแล้ว", "success");
        fetchPendingProducts();
      } catch (error) {
        Swal.fire("ผิดพลาด", "ไม่สามารถอนุมัติได้", "error");
      }
    }
  };

  const handleReject = async (id: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการปฏิเสธรายการ",
      text: "คุณต้องการลบสินค้าชิ้นนี้ออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.patch(
          `http://localhost:5000/products/admin/${id}/reject`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        Swal.fire("สำเร็จ", "ปฏิเสธรายการเรียบร้อยแล้ว", "success");
        fetchPendingProducts();
      } catch (error) {
        Swal.fire("ผิดพลาด", "ไม่สามารถปฎิเสธรายการได้", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shadow-xl z-20">
        <div
          className="mb-10 px-2 cursor-pointer"
          onClick={() => navigate("/admindashboard")}
        >
          <h1 className="text-xl font-black tracking-tighter italic uppercase">
            WELD<span className="text-[#FF85A2]">ADMIN</span>
          </h1>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">
            Compliance Unit
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem
            label="ภาพรวมระบบ"
            icon={<LayoutDashboard size={18} />}
            onClick={() => navigate("/admindashboard")}
          />
          <SidebarItem
            label="ตรวจสอบสลิป"
            icon={<CreditCard size={18} />}
            onClick={() => navigate("/adminverification")}
          />
          <SidebarItem
            label="อนุมัติสินค้า"
            icon={<Package size={18} />}
            active
            badge={pendingProducts.length}
          />
          <SidebarItem
            label="รายชื่อผู้ใช้"
            icon={<Users size={18} />}
            onClick={() => navigate("/adminusers")}
          />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-black w-full p-2 group"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PackageSearch size={16} className="text-[#FF85A2]" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Listing Management
              </p>
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              Product Approval
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">
                Items Pending
              </p>
              <p className="text-xl font-black text-[#FF85A2] leading-none">
                {pendingProducts.length}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <Package className="text-slate-200" size={24} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 max-w-5xl">
          {pendingProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center gap-8 hover:shadow-md hover:border-pink-50 transition-all group"
            >
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-50 flex-shrink-0 relative">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex-1 w-full space-y-4 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                      product.sellerType === "verified"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}
                  >
                    <Store size={10} />
                    {product.sellerName}
                  </div>
                  <span className="text-slate-300 font-mono text-[10px] font-bold">
                    #{product.sellerId}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0F172A] tracking-tight group-hover:text-[#FF85A2] transition-colors">
                    {product.productName}
                  </h3>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                    <Tag size={12} className="text-slate-300" />
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">
                      Listing Price
                    </span>
                    <span className="text-2xl font-black text-[#0F172A]">
                      {product.price.toLocaleString()} บาท
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full lg:w-48">
                <button
                  onClick={() => handleApprove(product.id)}
                  className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-black/10"
                >
                  <CheckCircle2 size={14} /> อนุมัติขาย
                </button>
                <button
                  onClick={() => handleReject(product.id)}
                  className="w-full py-3 text-slate-400 hover:text-red-500 font-black text-[9px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={14} /> ปฏิเสธรายการ
                </button>
              </div>
            </div>
          ))}

          {pendingProducts.length === 0 && (
            <div className="bg-white py-24 rounded-[3rem] text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <PackageSearch size={40} />
              </div>
              <div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                  All cleared!
                </p>
                <p className="text-slate-300 text-xs mt-1">
                  ไม่มีรายการสินค้าที่รอการตรวจสอบในขณะนี้
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ label, icon, active = false, badge = 0, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
        active
          ? "bg-[#FF85A2] text-white shadow-md shadow-black/15"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`${active ? "text-white" : "text-slate-500 group-hover:text-white"} transition-colors`}
        >
          {icon}
        </span>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {badge > 0 ? (
        <span
          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
            active ? "bg-white text-[#FF85A2]" : "bg-[#FF85A2] text-white"
          }`}
        >
          {badge}
        </span>
      ) : (
        active && <ChevronRight size={14} className="opacity-50" />
      )}
    </div>
  );
}
