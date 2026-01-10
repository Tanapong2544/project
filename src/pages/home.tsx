import { Link } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "../layouts/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex justify-center p-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="ค้นหาสินค้า"
            className="w-full px-4 py-2 rounded bg-white-800 text-zinc placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">ชิ้นงาน</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-right border p-4 rounded">
            <h3>แผ่นตรวจสอบความไวของน้ำยาแทรกซึม</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
          <div className="text-right border p-4 rounded">
            <h3>แผ่นตรวจสอบความไวของน้ำยาแทรกซึม</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
          <div className="text-right border p-4 rounded">
            <h3>แผ่นตรวจสอบความไวของน้ำยาแทรกซึม</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4"></h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-right border p-4 rounded">
            <h3>ผแผ่นตรวจเช็คเข็มทิศทางของสนามแม่เหล็ก</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
          <div className="text-right border p-4 rounded">
            <h3>แผ่นตรวจเช็คเข็มทิศทางของสนามแม่เหล็ก</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
          <div className="text-right border p-4 rounded">
            <h3>แผ่นตรวจเช็คเข็มทิศทางของสนามแม่เหล็ก</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4"></h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-right border p-4 rounded">
            <h3>ผแผ่นตรวจเช็คเข็มทิศทางของสนามแม่เหล็ก</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
          <div className="text-right border p-4 rounded">
            <h3>แผ่นตรวจเช็คเข็มทิศทางของสนามแม่เหล็ก</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
          <div className="text-right border p-4 rounded">
            <h3>แผ่นตรวจเช็คเข็มทิศทางของสนามแม่เหล็ก</h3>
            <p>3,000 บาท</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      







      <Footer/>
    </>
  );
}
