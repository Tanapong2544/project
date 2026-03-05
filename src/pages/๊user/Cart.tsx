import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  // 1. โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  // 2. ฟังก์ชันอัปเดต localStorage และแจ้ง Navbar
  const syncCart = (updatedCart: any[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // สะกิด Navbar ให้เลขเปลี่ยน
    window.dispatchEvent(new Event("cartUpdate"));
  };

  // 3. ฟังก์ชันเพิ่ม/ลดจำนวน
  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    syncCart(updated);
  };

  // 4. ฟังก์ชันลบสินค้า
  const removeItem = (id: string) => {
    if (window.confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) {
      const updated = cartItems.filter((item) => item.id !== id);
      syncCart(updated);
    }
  };

  // 5. คำนวณราคารวมทั้งหมด
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <h1 className="text-4xl font-black text-[#0F172A] mb-10 flex items-center gap-4">
          ตะกร้าสินค้าของคุณ
          <span className="text-sm bg-[#000000] text-white px-4 py-1 rounded-full font-bold">
            {cartItems.length} รายการ
          </span>
        </h1>

        {cartItems.length === 0 ? (
          // กรณีไม่มีสินค้าในตะกร้า
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-slate-400 mb-8">ไม่มีสินค้าในตะกร้าของคุณ</h2>
            <Link 
              to="/" 
              className="inline-block px-10 py-4 bg-[#0F172A] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#138B2E] transition-all"
            >
              ไปเลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* รายการสินค้า (Left Column) */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-all">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 object-contain bg-slate-50 rounded-2xl p-2"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0F172A] mb-1">{item.name}</h3>
                    <p className="text-[#1E293B] font-black">฿{item.price.toLocaleString()}</p>
                  </div>

                  {/* ตัวปรับจำนวน */}
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold hover:text-red-500"
                    >-</button>
                    <span className="font-black w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold hover:text-[#138B2E]"
                    >+</button>
                  </div>

                  {/* ปุ่มลบ */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* สรุปยอดเงิน (Right Column) */}
            <div className="lg:col-span-1">
              <div className="bg-[#0F172A] text-white rounded-[3rem] p-8 sticky top-28 shadow-2xl shadow-blue-900/20">
                <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">สรุปการสั่งซื้อ</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-white font-medium">
                    <span>ยอดรวมสินค้า</span>
                    <span>฿{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white font-medium">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-white font-bold">ฟรี</span>
                  </div>
                  <div className="h-[1px] bg-white/10 my-4"></div>
                  <div className="flex justify-between text-2xl font-black">
                    <span>รวมทั้งสิ้น</span>
                    <span className="text-white">฿{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/checkout")}
                  className="w-full py-5 bg-[#DB2777] hover:bg-[#BE185D] text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-lg shadow-green-900/20 transition-all transform active:scale-95"
                >
                  ดำเนินการชำระเงิน
                </button>
                
                <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest">
                  Secure checkout with K-Bank
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}