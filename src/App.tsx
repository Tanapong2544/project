import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Photo01 from "./assets/fluorescent-dye-penetrant.png";
import Photo02 from "./assets/visible-dye-penetrant.png";
import Photo03 from "./assets/ut-rt.png";

const PRODUCTS = [
  {
    id: "W001",
    category: "ชิ้นงานเชื่อม",
    name: "ชิ้นงานเชื่อมตรวจสอบด้วยสารแทรกซึมแบบเรืองแสง",
    price: 650,
    image: Photo01,
    details: "ชิ้นงานเหล็กคาร์บอนคุณภาพสูง มาพร้อมรอยร้าวจำลองขนาดเล็กพิเศษ เหมาะสำหรับการทดสอบด้วยสารแทรกซึมชนิดเรืองแสง",
  },
  {
    id: "W002",
    category: "ชิ้นงานเชื่อม",
    name: "ชิ้นงานเชื่อมสำหรับตรวจสอบด้วยสารแทรกซึมแบบมองเห็นด้วยตาเปล่า",
    price: 550,
    image: Photo02,
    details: "ชุดชิ้นงานสำหรับฝึกตรวจสอบ PT ชชนิดสีแดง ให้ค่าความต่างสีสูง ช่วยให้ระบุตำแหน่งรอยร้าวได้อย่างแม่นยำ",
  },
  {
    id: "W003",
    category: "ชิ้นงานเชื่อม",
    name: "ชิ้นงานเชื่อมสำหรับตรวจสอบแบบไม่ทำลาย (NDT Specimen)",
    price: 3500,
    image: Photo03,
    details: "ชิ้นงานทดสอบระดับสูงที่รวบรวมความบกพร่องภายใน เช่น Slag Inclusion และ Lack of Fusion สำหรับงาน UT/RT",
  },
  {
    id: "M001",
    category: "เครื่องมือวัด",
    name: "เกจวัดรอยเชื่อม (Welding Gauge) Hi-Lo",
    price: 1200,
    image: Photo03, 
    details: "อุปกรณ์วัดระดับความสูงต่ำของรอยเชื่อมและช่องว่างรอยต่อ ทำจากสแตนเลสสตีลทนทานสูง",
  },
  {
    id: "T001",
    category: "เครื่องมือช่าง",
    name: "แปรงลวดสแตนเลสสำหรับขัดรอยเชื่อม",
    price: 150,
    image: Photo01, 
    details: "แปรงลวดคุณภาพสูง ไม่เป็นสนิม เหมาะสำหรับทำความสะอาดแนวเชื่อมก่อนและหลังการทดสอบ",
  }
];

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const status = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(status);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      alert(`กรุณาเข้าสู่ระบบก่อนเพื่อเลือกซื้อ: ${product.name}`);
      navigate("/login");
      return;
    }
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = currentCart.findIndex((item: any) => item.id === product.id);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdate"));
    setSelectedProduct(null);
    alert(`เพิ่มลงในตะกร้าเรียบร้อยแล้ว`);
  };

  // Helper สำหรับจัดรูปแบบราคา
  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow">
        {/* Banner Hero Section */}
        <section className="bg-[#0F172A] text-white py-24 text-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4">นวัตกรรมวิศวกรรม <span className="text-[#FF85A2]">เพื่ออนาคต</span></h1>
            <p className="text-slate-400 max-w-lg mx-auto text-[10px] uppercase tracking-[0.4em] font-bold">Weld Defect Specimen Store</p>
          </div>
        </section>

        {/* Display Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-black text-[#0F172A] mb-12 flex items-center gap-4">
            สินค้าใหม่
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {PRODUCTS.map((product) => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col h-full hover:-translate-y-2"
              >
                {/* Image Wrapper */}
                <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-slate-50 border border-slate-50 p-6 flex items-center justify-center relative">
                  <img src={product.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] font-black uppercase text-[#DB2777] bg-white px-3 py-1.5 rounded-full shadow-sm border border-pink-50">{product.category}</span>
                  </div>
                </div>

                {/* Content */}
                <h4 className="font-bold text-[#0F172A] mb-3 h-12 overflow-hidden leading-tight group-hover:text-[#DB2777] transition-colors">{product.name}</h4>
                
                {/* Price Label (Adjusted) */}
                <div className="flex items-baseline gap-2 mb-6 mt-auto">
                  <p className="text-2xl font-black text-[#0F172A]">{formatPrice(product.price)}</p>
                  <span className="text-xs font-bold text-slate-400">บาท</span>
                </div>

                {/* Action Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    isLoggedIn 
                    ? 'bg-[#0F172A] text-white hover:bg-[#DB2777] shadow-lg shadow-blue-900/10' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoggedIn ? "เพิ่มลงในตะกร้าสินค้า" : "กรุณาเข้าสู่ระบบก่อนซื้อ"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal รายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-full font-bold hover:bg-red-500 hover:text-white transition-all z-20">✕</button>
            <div className="md:w-1/2 bg-slate-50 p-12 flex items-center justify-center border-r border-slate-100">
              <img src={selectedProduct.image} className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl" alt="" />
            </div>
            <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#DB2777] mb-2">{selectedProduct.category} | {selectedProduct.id}</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-6 leading-tight">{selectedProduct.name}</h2>
              <div className="h-[2px] w-12 bg-[#FF85A2] mb-6"></div>
              <p className="text-slate-500 mb-10 text-sm leading-relaxed">{selectedProduct.details}</p>
              
              {/* Price Label In Modal (Adjusted) */}
              <div className="mb-10 flex items-baseline gap-2">
                <p className="text-4xl font-black text-[#0F172A]">{formatPrice(selectedProduct.price)}</p>
                <span className="text-lg font-bold text-slate-400">บาท</span>
              </div>

              <button 
                onClick={() => handleAddToCart(selectedProduct)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all transform active:scale-95 ${isLoggedIn ? 'bg-[#0F172A] hover:bg-[#DB2777] text-white shadow-xl' : 'bg-slate-100 text-slate-400'}`}
              >
                {isLoggedIn ? "เพิ่มลงในตะกร้าสินค้า" : "กรุณาเข้าสู่ระบบก่อนซื้อ"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}