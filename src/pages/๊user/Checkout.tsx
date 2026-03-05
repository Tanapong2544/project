import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

const PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชราชธานี"
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    subDistrict: "", // ตำบล / แขวง
    district: "",    // อำเภอ / เขต
    province: "",
    zipcode: "",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (savedCart.length === 0) navigate("/cart");
    setCartItems(savedCart);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("shippingInfo", JSON.stringify(formData));
    navigate("/payment"); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">ข้อมูลการจัดส่ง</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* ชื่อ และ เบอร์ */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2">ชื่อ-นามสกุล ผู้รับ</label>
                <input required name="name" onChange={handleInputChange} className="w-full mt-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0F172A] outline-none shadow-sm" placeholder="" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2">เบอร์โทรศัพท์ติดต่อ</label>
                <input required name="phone" onChange={handleInputChange} className="w-full mt-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0F172A] outline-none shadow-sm" placeholder="" />
              </div>

              {/* ที่อยู่ */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2">ที่อยู่ (เลขที่บ้าน, หมู่, ซอย, ถนน)</label>
                <textarea required name="address" onChange={handleInputChange} rows={2} className="w-full mt-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0F172A] outline-none shadow-sm resize-none" placeholder="" />
              </div>

              {/* แขวง และ เขต */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2">ตำบล / แขวง</label>
                <input required name="subDistrict" onChange={handleInputChange} className="w-full mt-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0F172A] outline-none shadow-sm" placeholder="" />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2">อำเภอ / เขต</label>
                <input required name="district" onChange={handleInputChange} className="w-full mt-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0F172A] outline-none shadow-sm" placeholder="" />
              </div>

              {/* จังหวัด และ รหัสไปรษณีย์ */}
              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2">จังหวัด</label>
                <select required name="province" onChange={handleInputChange} className="w-full mt-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0F172A] outline-none shadow-sm cursor-pointer appearance-none">
                  <option value="">เลือกจังหวัด</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2">รหัสไปรษณีย์</label>
                <input required name="zipcode" onChange={handleInputChange} className="w-full mt-1 p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#0F172A] outline-none shadow-sm" placeholder="" />
              </div>
            </div>
          </div>

          {/* สรุปออเดอร์ (ขวามือ) */}
          <div className="bg-[#0F172A] text-white rounded-[3rem] p-10 h-fit sticky top-28 shadow-xl">
             <h3 className="text-xl font-black mb-6">สรุปคำสั่งซื้อ</h3>
             <div className="space-y-4 mb-8 border-b border-white/10 pb-6 max-h-40 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">{item.name} x{item.quantity}</span>
                    <span className="font-black">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
             </div>
             <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">ยอดชำระสุทธิ</span>
                <span className="text-3xl font-black text-[#FF85A2]">฿{totalPrice.toLocaleString()}</span>
             </div>
             <button type="submit" className="w-full mt-10 py-5 bg-[#DB2777] hover:bg-[#BE185D] text-white rounded-2xl font-black uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-pink-900/20">
               ชำระเงิน <span className="ml-2">→</span>
             </button>
          </div>

        </form>
      </main>
      <Footer />
    </div>
  );
}