import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/Logo_Welddefectspecimen.svg";
import Swal from "sweetalert2";

export default function Navbar() {
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();

  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(savedCart.length);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdate", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdate", updateCartCount);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "คุณต้องการออกจากระบบ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("cart");
      localStorage.removeItem("shippingInfo");
      localStorage.removeItem("username");
      window.location.href = "/";
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-100 px-6 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="h-12 w-auto">
            <img
              src={Logo}
              alt="WeldDefect Logo"
              className="h-full w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-2 text-[13px] font-black uppercase tracking-wider text-slate-400">
          {[
            { name: "หน้าแรก", path: "/" },
            { name: "หมวดหมู่สินค้า", path: "/category" },
            { name: "คำสั่งซื้อ", path: "/orders" },
            { name: "คำถามที่พบบ่อย", path: "/faq" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-2 rounded-xl transition-all relative group ${isActive(link.path) ? "text-[#0F172A]" : "hover:text-[#0F172A]"}`}
            >
              {link.name}
              <span
                className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-[3px] rounded-full bg-[#FF85A2] transition-all duration-300 ${isActive(link.path) ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-50"}`}
              ></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className={`relative p-3 rounded-2xl transition-all group ${isActive("/cart") ? "bg-slate-100 text-[#DB2777]" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <span className="text-xl transition-transform group-hover:scale-110 block">
              🛒
            </span>
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 bg-[#DB2777] text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 pl-2 border-l border-slate-100 ml-2">
              <div className="hidden md:flex flex-col items-end leading-tight">
                <span className="text-[9px] font-black text-[#DB2777] uppercase tracking-[0.2em]">
                  {user?.role || "USER"}
                </span>
                <span className="text-xs font-black text-[#0F172A]">
                  {user?.username || "Guest"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-lg transition-all duration-300"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Logout
                </span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-2xl text-[10px] font-black shadow-lg hover:from-[#DB2777] hover:to-[#FF85A2] transition-all uppercase tracking-[0.15em]"
            >
              Login / Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
