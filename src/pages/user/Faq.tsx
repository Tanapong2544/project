import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

const FAQS = [
  {
    category: "การสั่งซื้อและชำระเงิน",
    questions: [
      {
        q: "สั่งซื้อสินค้าแล้วต้องชำระเงินภายในกี่วัน?",
        a: "หลังจากทำรายการสั่งซื้อ ระบบจะจองสินค้าไว้ให้เป็นเวลา 24 ชั่วโมง หากไม่มีการแจ้งชำระเงินภายในเวลาดังกล่าว ระบบจะยกเลิกออเดอร์โดยอัตโนมัติครับ"
      },
      {
        q: "สามารถขอใบกำกับภาษีเต็มรูปแบบได้หรือไม่?",
        a: "ได้ครับ ลูกค้าสามารถกรอกรายละเอียดที่อยู่และเลขประจำตัวผู้เสียภาษีในหน้าชำระเงิน หรือแจ้งแอดมินผ่านทาง Line เพื่อขอใบกำกับภาษีได้เลยครับ"
      }
    ]
  },
  {
    category: "การจัดส่งสินค้า",
    questions: [
      {
        q: "ใช้ระยะเวลานานแค่ไหนในการจัดส่ง?",
        a: "สำหรับสินค้าที่มีสต็อก เราจะจัดส่งภายใน 1-2 วันทำการ โดยปกติลูกค้าในกรุงเทพฯ จะได้รับสินค้าภายใน 1-2 วัน และต่างจังหวัดภายใน 2-4 วันครับ"
      },
      {
        q: "สามารถติดตามสถานะพัสดุได้ที่ไหน?",
        a: "เมื่อเราทำการจัดส่งแล้ว ระบบจะส่งเลข Tracking ไปยังอีเมลของท่าน หรือท่านสามารถเช็คสถานะได้ที่เมนู 'ประวัติการสั่งซื้อ' ในหน้าบัญชีผู้ใช้ครับ"
      }
    ]
  },
  {
    category: "เกี่ยวกับตัวสินค้า (Specimen)",
    questions: [
      {
        q: "ชิ้นงานเชื่อม (Specimen) มีใบเซอร์รับรองหรือไม่?",
        a: "ชิ้นงาน NDT Specimen ทุกชิ้นของเราผ่านมาตรฐานการตรวจสอบ และมีเอกสารรับรองรอยบกพร่อง (Defect Report) แนบไปพร้อมกับตัวสินค้าครับ"
      }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-[#0F172A] text-white py-20 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Frequently Asked Questions</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">เราพร้อมตอบทุกข้อสงสัยเกี่ยวกับการบริการของเรา</p>
            
            {/* Search Bar */}
            <div className="mt-10 relative max-w-lg mx-auto">
              <input 
                type="text" 
                placeholder="ค้นหาคำถามที่ต้องการ..." 
                className="w-full px-8 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md focus:bg-white focus:text-[#0F172A] outline-none transition-all placeholder:text-slate-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF85A2] opacity-10 blur-[100px]"></div>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-16">
          {FAQS.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-12">
              <h2 className="text-xs font-black text-[#DB2777] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#DB2777]"></span>
                {group.category}
              </h2>
              
              <div className="space-y-4">
                {group.questions
                  .filter(item => item.q.includes(searchTerm) || item.a.includes(searchTerm))
                  .map((item, itemIdx) => {
                    const id = `${groupIdx}-${itemIdx}`;
                    const isOpen = openIndex === id;
                    
                    return (
                      <div key={id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all shadow-sm hover:shadow-md">
                        <button 
                          onClick={() => toggleAccordion(id)}
                          className="w-full px-6 py-5 text-left flex justify-between items-center group"
                        >
                          <span className={`font-bold text-sm transition-colors ${isOpen ? 'text-[#DB2777]' : 'text-[#0F172A]'}`}>
                            {item.q}
                          </span>
                          <span className={`text-xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#DB2777]' : 'text-slate-300'}`}>
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        
                        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                          <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}