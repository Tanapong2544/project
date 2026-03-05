import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/products", {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price), // แปลงเป็นตัวเลขก่อนส่ง
        stock: Number(productData.stock), // แปลงเป็นตัวเลขก่อนส่ง
      });

      await swal.fire({
        icon: "success",
        title: "เพิ่มสินค้าสำเร็จ",
        text: "ข้อมูลสินค้าถูกบันทึกเรียบร้อยแล้ว",
        confirmButtonColor: "#0F172A",
      });

      navigate("/products"); // หรือหน้า List สินค้า
    } catch (err: any) {
      swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถเพิ่มสินค้าได้",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#0F172A]">เพิ่มสินค้าใหม่</h2>
          <p className="text-slate-400 text-sm mt-2">กรอกรายละเอียดสินค้าเพื่อนำขึ้นระบบ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Product Name</label>
            <input
              name="name"
              required
              value={productData.name}
              onChange={handleChange}
              placeholder="ชื่อสินค้า"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#0F172A] outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
            <textarea
              name="description"
              rows={3}
              value={productData.description}
              onChange={handleChange}
              placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#0F172A] outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Price (THB)</label>
              <input
                name="price"
                type="number"
                required
                value={productData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#0F172A] outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Stock Quantity</label>
              <input
                name="stock"
                type="number"
                required
                value={productData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#0F172A] outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-[2] bg-[#0F172A] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg transition-all active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}