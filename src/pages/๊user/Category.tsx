import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

// ดึงข้อมูลสินค้า (ในโปรเจกต์จริงอาจดึงจาก API หรือไฟล์กลาง)
import Photo01 from "../../assets/fluorescent-dye-penetrant.png";
import Photo02 from "../../assets/visible-dye-penetrant.png";
import Photo03 from "../../assets/ut-rt.png";

const ALL_PRODUCTS = [
  {
    id: "W001",
    category: "ชิ้นงานเชื่อม",
    name: "ชิ้นงานเชื่อมตรวจสอบด้วยสารแทรกซึมแบบเรืองแสง",
    price: 650,
    image: Photo01,
  },
  {
    id: "W002",
    category: "ชิ้นงานเชื่อม",
    name: "ชิ้นงานเชื่อมสำหรับตรวจสอบด้วยสารแทรกซึมแบบมองเห็นด้วยตาเปล่า",
    price: 550,
    image: Photo02,
  },
  {
    id: "W003",
    category: "ชิ้นงานเชื่อม",
    name: "ชิ้นงานเชื่อมสำหรับตรวจสอบแบบไม่ทำลาย (NDT Specimen)",
    price: 3500,
    image: Photo03,
  },
  {
    id: "M001",
    category: "เครื่องมือวัด",
    name: "เกจวัดรอยเชื่อม (Welding Gauge) Hi-Lo",
    price: 1200,
    image: Photo03,
  },
  {
    id: "T001",
    category: "เครื่องมือช่าง",
    name: "แปรงลวดสแตนเลสสำหรับขัดรอยเชื่อม",
    price: 150,
    image: Photo01,
  },
];

const CATEGORIES = [
  "ทั้งหมด",
  "ชิ้นงานเชื่อม",
  "เครื่องมือวัด",
  "เครื่องมือช่าง",
];

export default function Category() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState("ทั้งหมด");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const filteredProducts =
    selectedCat === "ทั้งหมด"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === selectedCat);

  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้า");
      navigate("/login");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((item: any) => item.id === product.id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdate"));
    alert("เพิ่มลงในตะกร้าแล้ว");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-2xl font-black text-[#0F172A] mb-2 uppercase tracking-tighter">
            หมวดหมู่สินค้า
          </h1>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                selectedCat === cat
                  ? "bg-[#0F172A] text-white shadow-xl shadow-blue-900/20 scale-105"
                  : "bg-white text-slate-400 border border-slate-100 hover:border-[#FF85A2] hover:text-[#FF85A2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
            >
              {/* Image */}
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-slate-50 p-6 flex items-center justify-center relative">
                <img
                  src={product.image}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  alt={product.name}
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] font-black uppercase text-[#DB2777] bg-white px-3 py-1.5 rounded-full shadow-sm border border-pink-50">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h4 className="font-bold text-[#0F172A] mb-3 h-12 overflow-hidden leading-tight group-hover:text-[#DB2777] transition-colors">
                {product.name}
              </h4>

              <div className="flex items-baseline gap-2 mb-6 mt-auto">
                <p className="text-2xl font-black text-[#0F172A]">
                  {formatPrice(product.price)}
                </p>
                <span className="text-xs font-bold text-slate-400">บาท</span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  isLoggedIn
                    ? "bg-[#0F172A] text-white hover:bg-[#DB2777] shadow-lg shadow-blue-900/10 active:scale-95"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isLoggedIn
                  ? "เพิ่มลงในตะกร้าสินค้า"
                  : "กรุณาเข้าสู่ระบบก่อนซื้อ"}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">
              ไม่พบสินค้าในหมวดหมู่นี้
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
