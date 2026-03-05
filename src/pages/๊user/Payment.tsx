import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function Payment() {
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = savedCart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    setTotalAmount(total);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSlipImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipImage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      alert("แจ้งชำระเงินเรียบร้อย! เจ้าหน้าที่จะตรวจสอบสลิปภายใน 24 ชม.");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdate"));
      navigate("/");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-12">
        
        {/* --- Back Button --- */}
        <button 
          onClick={() => navigate("/cart")}
          className="group flex items-center gap-3 text-slate-400 hover:text-[#0F172A] transition-all mb-10 font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <span className="bg-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-sm group-hover:shadow-md transition-all text-lg">
            ←
          </span>
          Back to Cart
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-[#0F172A] mb-3 tracking-tighter uppercase">ชำระเงิน</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Checkout Verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Section 01: Bank Details & Total Amount */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0F172A] mb-8 flex items-center gap-3">
                <span className="bg-[#1E40AF] text-white w-8 h-8 flex items-center justify-center rounded-xl text-[10px] font-black">01</span>
                Bank Transfer
              </h2>
              
              <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-12 h-12 bg-[#138B2E] rounded-xl flex items-center justify-center text-white font-black text-[10px]">
                    K+
                  </div>
                  <div>
                    <p className="font-black text-[#0F172A]">ธนาคารกสิกรไทย</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Kasikorn Bank</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Account Number</p>
                    <p className="text-3xl font-black text-[#0F172A] tracking-tight">033-1-00226-7</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Account Name</p>
                    <p className="text-xs font-black text-[#0F172A] leading-tight opacity-70">
                      มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✨ ปรับ Total Amount ให้ Minimal และไม่เด่นเกินไป ✨ */}
            <div className="mt-4 pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between bg-[#F8FAFC] px-6 py-4 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Amount</p>
                  <p className="text-[9px] text-slate-300 font-bold uppercase leading-none">ยอดชำระสุทธิ</p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1 text-[#0F172A]">
                    <span className="text-sm font-bold">฿</span>
                    <span className="text-3xl font-black tracking-tighter">
                      {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 02: Upload Slip */}
          <form onSubmit={handleSubmitOrder} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <h2 className="text-xl font-black text-[#0F172A] mb-8 flex items-center gap-3">
              <span className="bg-[#DB2777] text-white w-8 h-8 flex items-center justify-center rounded-xl text-[10px] font-black">02</span>
              Upload Slip
            </h2>

            <label className="relative group cursor-pointer flex-grow min-h-[300px]">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              
              {slipImage ? (
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden border-2 border-[#DB2777]/20 shadow-inner group">
                  <img src={slipImage} alt="Slip Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#0F172A]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                    <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] bg-[#DB2777] px-6 py-3 rounded-full">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-4 hover:border-[#DB2777] hover:bg-pink-50/30 transition-all">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">📄</div>
                  <div className="text-center">
                    <p className="font-black text-[#0F172A] text-[11px] uppercase tracking-widest">อัปโหลดสลิปธนาคาร</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Tap to upload your payment receipt</p>
                  </div>
                </div>
              )}
            </label>

            <button 
              type="submit"
              disabled={isSubmitting || !slipImage}
              className={`w-full mt-8 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl ${
                slipImage && !isSubmitting
                ? "bg-[#10B981] text-white hover:bg-[#059669] hover:scale-[1.02] hover:scale-[1.02] shadow-blue-900/10" 
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Processing..." : "Confirm & Send"}
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}