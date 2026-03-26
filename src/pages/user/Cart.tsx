import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import type { CartItem } from "../../store/useCartStore";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Swal from "sweetalert2";

export default function Cart() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const totalPrice = items.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0,
  );

  const handleRemove = (id: string) => {
    Swal.fire({
      title: "ลบสินค้า?",
      text: "คุณต้องการลบรายการนี้ออกจากตะกร้าใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "ลบรายการ",
      cancelButtonText: "ยกเลิก",
      customClass: {
        popup: "rounded-[2rem]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(id);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <h1 className="text-4xl font-black text-[#0F172A] mb-10 tracking-tight uppercase">
              Shopping Cart
              <span className="ml-4 text-sm font-bold text-slate-400">
                ({items.length} items)
              </span>
            </h1>

            {items.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
                <div className="text-6xl mb-6">🛒</div>
                <h3 className="text-xl font-black text-[#0F172A] mb-2">
                  ตะกร้าของคุณยังว่างอยู่
                </h3>
                <p className="text-slate-400 mb-8 font-bold">
                  ลองเลือกดูสินค้าที่น่าสนใจในหน้าแรกดูสิ
                </p>
                <Link
                  to="/"
                  className="inline-block px-10 py-4 bg-[#0F172A] text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105"
                >
                  เริ่มช้อปปิ้ง
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                  >
                    <img
                      src={`http://localhost:5000/uploads/products/${item.image}`}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-2xl bg-slate-50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150";
                      }}
                    />

                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-lg font-black text-[#0F172A] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[#DB2777] font-black text-sm">
                        ฿{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                      {/* ปุ่มลดสินค้า */}
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        disabled={item.quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-black hover:bg-[#0F172A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        -
                      </button>

                      <span className="w-8 text-center font-black text-[#0F172A]">
                        {item.quantity}
                      </span>

                      {/* ปุ่มเพิ่มสินค้า */}
                      <button
                        onClick={() => {
                          if (item.quantity < (item.stock || 99)) {
                            updateQuantity(item.id, item.quantity + 1);
                          } else {
                            Swal.fire({
                              icon: "warning",
                              title: "สินค้าหมด",
                              text: "ไม่สามารถเพิ่มจำนวนได้ เนื่องจากสินค้าในสต็อกไม่เพียงพอ",
                              confirmButtonColor: "#0F172A",
                            });
                          }
                        }}
                        disabled={item.quantity >= (item.stock || 99)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-black hover:bg-[#0F172A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <p className="text-xl font-black text-[#0F172A]">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-4 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <span className="text-xl">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="lg:w-[400px]">
              <div className="bg-[#0F172A] text-white rounded-[3rem] p-10 sticky top-28 shadow-2xl">
                <h2 className="text-xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-widest">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                      Subtotal
                    </span>
                    <span className="font-black text-lg">
                      ฿{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-10">
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                    Total
                  </span>
                  <span className="text-4xl font-black text-[#FF85A2]">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-6 bg-[#DB2777] hover:bg-[#BE185D] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all transform active:scale-95 shadow-lg shadow-pink-900/40"
                >
                  Proceed to Checkout <span className="ml-2 text-lg">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
