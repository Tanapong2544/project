import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"; 
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useAuth } from "../../hooks/useAuth";

export default function Category() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products/all");
        setAllProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    "ทั้งหมด",
    ...Array.from(new Set(allProducts.map((p) => p.category))),
  ];

  const filteredProducts =
    selectedCat === "ทั้งหมด"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCat);
  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบก่อนเพื่อเพิ่มสินค้าลงในตะกร้า",
        confirmButtonColor: "#0F172A",
        confirmButtonText: "เข้าสู่ระบบ",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((item: any) => item.id === product.id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdate"));

    Swal.fire({
      icon: "success",
      title: "เพิ่มลงตะกร้าสำเร็จ",
      html: `คุณได้เพิ่ม <b>${product.name}</b><br>ลงในตะกร้าสินค้าเรียบร้อยแล้ว`,
      confirmButtonColor: "#0F172A",
      timer: 1500,
      timerProgressBar: true,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-2xl font-black text-[#0F172A] mb-2 uppercase tracking-tighter">
            หมวดหมู่สินค้า
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 mb-16">
          {categories.map((cat) => (
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
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">
            กำลังโหลดรายการสินค้า...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full hover:-translate-y-2"
              >
                <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-slate-50 p-6 flex items-center justify-center relative">
                  <img
                    src={`http://localhost:5000/uploads/products/${product.image}`}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    alt={product.name}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] font-black uppercase text-[#DB2777] bg-white px-3 py-1.5 rounded-full shadow-sm border border-pink-50">
                      {product.category}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-[#0F172A] mb-3 h-12 overflow-hidden leading-tight group-hover:text-[#DB2777] transition-colors">
                  {product.name}
                </h4>

                <div className="flex items-baseline gap-2 mb-6 mt-auto">
                  <p className="text-2xl font-black text-[#0F172A]">
                    {formatPrice(product.price)}
                  </p>
                  <span className="text-xs font-bold text-slate-400">บาท</span>
                </div>

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
        )}

        {filteredProducts.length === 0 && !loading && (
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
