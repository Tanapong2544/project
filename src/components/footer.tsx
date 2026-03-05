import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    // ✨ จุดสำคัญ: เติม id="contact-footer" ลงในแท็ก footer
    <footer id="contact-footer" className="bg-gradient-to-r from-[#1E40AF] to-[#DB2777] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Contact Section */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">ช่องทางติดต่อ</h4>
          <div className="space-y-2 text-sm text-white/80">
            <p>
              <span className="font-bold text-white">ที่อยู่ : </span> 
              มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ 1518 ถนนประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800 
            </p>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">เกี่ยวกับเรา</h4>
          <div className="space-y-2 text-sm text-white/80 font-mono">
            <p className="flex items-center gap-2">เบอร์ติดต่อ : 09-682-5677</p>
            <p className="flex items-center gap-2">Line : Weldfect</p>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">ติดตามเรา</h4>
          <div className="flex gap-4">
            {['Facebook', 'Line'].map((social) => (
              <div 
                key={social} 
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/40 hover:scale-110 transition-all border border-white/30"
                title={social}
              >
                <span className="text-[10px] font-black">{social[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center">
        <p className="text-[10px] text-white/50 font-medium uppercase tracking-[0.2em]">
          © 2026 WeldDefect. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}