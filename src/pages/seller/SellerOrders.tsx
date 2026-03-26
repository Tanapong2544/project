import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  Eye,
  Clock,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";

interface Order {
  id: number;
  orderNumber: string;
  buyerName: string;
  totalAmount: number;
  status: "pending" | "shipping" | "delivered";
  createdAt: string;
  items: any[];
  recipient_name: string;
  phone: string;
  address: string;
}

interface SidebarLinkProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: any = {
    pending: {
      color: "bg-amber-50 text-amber-600 border-amber-100",
      icon: <Clock size={12} />,
      label: "รอจัดส่ง",
    },
    paid: {
      color: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <CheckCircle2 size={12} />,
      label: "ชำระเงินแล้ว",
    },
    shipping: {
      color: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <Truck size={12} />,
      label: "กำลังจัดส่ง",
    },
    delivered: {
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: <CheckCircle2 size={12} />,
      label: "สำเร็จแล้ว",
    },
  };

  const current = config[status] || {
    color: "bg-slate-50 text-slate-400",
    icon: null,
    label: status,
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black tracking-tighter ${current.color}`}
    >
      {current.icon}
      {current.label}
    </div>
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
    className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
      active
        ? "bg-[#FF85A2] text-white shadow-lg shadow-pink-500/20"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`}
  >
    <div className="flex items-center gap-3">
      <span
        className={`${active ? "text-white" : "text-slate-500 group-hover:text-white"}`}
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

export default function SellerOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("ทั้งหมด");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const currentUser = {
    name: "นายเอ สวัสดี",
    id: "ID:1",
    avatar: `https://ui-avatars.com/api/?name=น&background=FF85A2&color=fff&bold=true`,
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "http://localhost:5000/orders/seller/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://localhost:5000/orders/seller/update/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const getStatusLabel = (status: string) => {
    const map: any = {
      pending: "รอจัดส่ง",
      shipping: "กำลังจัดส่ง",
      delivered: "สำเร็จแล้ว",
    };
    return map[status] || status;
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
            Management Portal
          </p>
        </div>

        <div className="mb-8 px-2 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <img
            src={currentUser.avatar}
            className="w-10 h-10 rounded-xl shadow-inner"
            alt="profile"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate">{currentUser.name}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              {currentUser.id}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink
            label="ภาพรวมระบบ"
            icon={<LayoutDashboard size={18} />}
            onClick={() => navigate("/SellerDashboard")}
          />
          <SidebarLink
            label="จัดการสินค้า"
            icon={<Package size={18} />}
            onClick={() => navigate("/SellerInventory")}
          />
          <SidebarLink
            label="คำสั่งซื้อ"
            icon={<FileText size={18} />}
            active
            badge={orders.filter((o) => o.status === "pending").length}
          />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 text-slate-400 hover:text-[#FF85A2] transition text-sm font-black w-full p-2 group"
          >
            <LogOut
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />{" "}
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-8 bg-[#FF85A2] rounded-full"></span>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Order Processing
              </p>
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Orders
            </h2>
          </div>

          <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
            {["ทั้งหมด", "รอจัดส่ง", "กำลังจัดส่ง", "สำเร็จแล้ว"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                  filter === tab
                    ? "bg-[#0F172A] text-white shadow-lg"
                    : "text-slate-500 hover:text-[#0F172A] hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] uppercase font-black text-slate-400 tracking-widest">
                <th className="px-8 py-6">Order ID & Date</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6 text-right">Total Amount</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[#0F172A]">
              {orders
                .filter(
                  (o) =>
                    filter === "ทั้งหมด" || getStatusLabel(o.status) === filter,
                )
                .map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-black">{order.orderNumber}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black">{order.buyerName}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black">
                        {Number(order.totalAmount).toLocaleString()} บาท
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-[#FF85A2] transition-all shadow-md active:scale-95"
                      >
                        <Eye size={14} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl">
                Order: {selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm font-bold border-b pb-2"
                >
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>{item.price} บาท</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(selectedOrder.id, "shipping")}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-700 transition"
              >
                กำลังจัดส่งสินค้า
              </button>
              <button
                onClick={() => updateStatus(selectedOrder.id, "delivered")}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-emerald-700 transition"
              >
                จัดส่งสินค้าสำเร็จ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
