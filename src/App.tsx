import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import axios from "axios";
import Swal from "sweetalert2";

export default function App() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products/all");
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = currentCart.findIndex(
      (item: any) => item.id === product.id,
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdate"));
    setSelectedProduct(null);

    Swal.fire({
      icon: "success",
      title: "เพิ่มสินค้าลงตะกร้าสำเร็จ",
      text: `${product.name} ถูกเพิ่มเข้าตะกร้าแล้ว`,
      confirmButtonColor: "#0F172A",
      timer: 1500,
    });
  };

  const formatPrice = (price: any) => {
    const num = parseFloat(price);
    return isNaN(num)
      ? "0.00"
      : num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-[#0F172A] text-white py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            นวัตกรรมวิศวกรรม <span className="text-[#FF85A2]">เพื่ออนาคต</span>
          </h1>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-black text-[#0F172A] mb-12">
            สินค้าทั้งหมด
          </h2>

          {loading ? (
            <div className="text-center py-20 font-bold text-slate-400">
              กำลังโหลดรายการสินค้า...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-slate-50 p-6 flex items-center justify-center">
                    <img
                      src={`http://localhost:5000/uploads/products/${product.image}`}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      alt={product.name}
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase text-[#DB2777] mb-2">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-[#0F172A] mb-3 h-12 overflow-hidden">
                    {product.name}
                  </h4>
                  <p className="text-2xl font-black mb-6 mt-auto">
                    {formatPrice(product.price)} บาท
                  </p>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      isLoggedIn
                        ? "bg-[#0F172A] text-white hover:bg-[#DB2777]"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoggedIn ? "เพิ่มลงตะกร้า" : "กรุณาเข้าสู่ระบบก่อนซื้อ"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] p-10 flex flex-col md:flex-row gap-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 font-bold"
            >
              ✕
            </button>
            <div className="md:w-1/2 flex items-center justify-center bg-slate-50 rounded-3xl">
              <img
                src={`http://localhost:5000/uploads/products/${selectedProduct.image}`}
                className="max-h-80"
                alt=""
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-black mb-4">
                {selectedProduct.name}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                หมวดหมู่: {selectedProduct.category}
              </p>
              <p className="text-sm text-slate-700 mb-6">
                {selectedProduct.description}
              </p>
              <p className="text-4xl font-black mb-6">
                {formatPrice(selectedProduct.price)} บาท
              </p>
              <button
                onClick={() => handleAddToCart(selectedProduct)}
                className={`w-full py-5 rounded-2xl font-black uppercase transition-all ${
                  isLoggedIn
                    ? "bg-[#0F172A] text-white hover:bg-[#DB2777]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isLoggedIn ? "เพิ่มลงตะกร้า" : "กรุณาเข้าสู่ระบบก่อนซื้อ"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
