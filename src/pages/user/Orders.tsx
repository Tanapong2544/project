import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Photo03 from "../../assets/ut-rt.png";
import photo01 from "../../assets/fluorescent-dye-penetrant.png";

import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  MapPin,
  ChevronRight
} from "lucide-react";

// --- Interfaces ---
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: OrderItem[];
}

// --- Main Page Component ---
export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับควบคุม Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Mock Data จำลองข้อมูลออเดอร์
        setTimeout(() => {
          setOrders([
            {
              id: "ORD-001",
              date: "03 มีนาคม 2026",
              status: "Processing",
              total: 3500.00,
              items: [
                { id: "W001", name: "ชิ้นงานเชื่อมสำหรับตรวจสอบแบบไม่ทำลาย (NDT Specimen)", quantity: 1, price: 3500, image: Photo03 }
              ]
            },
            {
              id: "ORD-002",
              date: "01 มีนาคม 2026",
              status: "Delivered",
              total: 650.00,
              items: [
                { id: "M002", name: "ชิ้นงานเชื่อมตรวจสอบด้วยสารแทรกซึมแบบเรืองแสง", quantity: 1, price: 650, image: photo01 }
              ]
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending": return { label: "รอชำระเงิน", color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Clock size={14} /> };
      case "Processing": return { label: "กำลังเตรียมสินค้า", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Package size={14} /> };
      case "Shipped": return { label: "จัดส่งแล้ว", color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: <Package size={14} /> };
      case "Delivered": return { label: "จัดส่งสำเร็จ", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={14} /> };
      case "Cancelled": return { label: "ยกเลิกแล้ว", color: "text-slate-400 bg-slate-50 border-slate-100", icon: <AlertCircle size={14} /> };
      default: return { label: status, color: "bg-slate-100", icon: null };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight mb-2">คำสั่งซื้อของฉัน</h1>
          <p className="text-slate-500 text-sm font-medium">จัดการประวัติการสั่งซื้อและดูรายละเอียดสินค้า</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF85A2]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  {/* Card Header */}
                  <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ORDER ID</span>
                        <span className="text-sm font-black text-[#0F172A]">{order.id}</span>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase ${statusInfo.color}`}>
                        {statusInfo.label}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{order.date}</span>
                  </div>

                  {/* Card Body (Items Preview) */}
                  <div className="p-8">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-slate-100" alt="" />
                        <div className="flex-grow">
                          <h4 className="font-bold text-[#0F172A] text-sm leading-tight">{item.name}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-1">จำนวน {item.quantity} ชิ้น</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="px-8 py-6 border-t border-slate-50 bg-white flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ยอดสุทธิ</p>
                        <p className="text-xl font-black text-[#0F172A]">{order.total.toLocaleString()}.-</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="bg-[#0F172A] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#DB2777] transition-all active:scale-95 flex items-center gap-2"
                    >
                      ดูรายละเอียด <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* เรียกใช้งาน Modal */}
      <OrderDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />

      <Footer />
    </div>
  );
}

// --- Sub-Component: Order Detail Modal ---
function OrderDetailModal({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: Order | null }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop พื้นหลังเบลอ */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* เนื้อหา Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ข้อมูลคำสั่งซื้อ</span>
            <h2 className="text-xl font-black text-[#0F172A]">{order.id}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* ส่วนที่ 1: รายการสินค้า */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-black">
              <Package size={14} /> สินค้าที่สั่งซื้อ
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-[#0F172A] leading-tight">{item.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">จำนวน {item.quantity} x {item.price.toLocaleString()}.-</p>
                  </div>
                  <p className="text-sm font-black text-[#0F172A]">{(item.quantity * item.price).toLocaleString()}.-</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-50" />

          {/* ส่วนที่ 2: ที่อยู่จัดส่ง */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-black">
              <MapPin size={14} /> ที่อยู่จัดส่งพัสดุ
            </h3>
            <div className="bg-[#F8FAFC] p-6 rounded-[1.5rem] border border-slate-100">
              <p className="text-sm font-black text-[#0F172A] mb-1">บริษัท ทดสอบวิศวกรรม จำกัด (สำนักงานใหญ่)</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                123/45 ซอยสุขุมวิท 21 แขวงคลองเตยเหนือ <br />
                เขตวัฒนา กรุงเทพมหานคร 10110 <br />
                <span className="text-[#0F172A] font-bold">โทร: 02-xxx-xxxx</span>
              </p>
            </div>
          </section>

          {/* สรุปยอดสั้นๆ */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-50">
            <span className="text-sm font-bold text-slate-400">ราคาสุทธิรวม VAT</span>
            <span className="text-2xl font-black text-[#0F172A]">{order.total.toLocaleString()}.-</span>
          </div>
        </div>

        {/* ปุ่ม Footer สำหรับปิด */}
        <div className="p-8 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#DB2777] transition-all shadow-lg active:scale-95"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}