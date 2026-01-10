import { Link } from "react-router-dom";
import logo from "../../assets/Logo_Welddefectspecimen.svg";
export default function Login() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="flex flex-col items-center text-2xl font-bold text-gray-900 mb-6 text-center">
            <img src={logo} alt="Logo" className="w-60 h-30 mb-2" />
            เข้าสู่ระบบ (Sign In)
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อบัญชี / Username
              </label>
              <input
                type="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน / Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                placeholder=""
              />
            </div>
            <div>
              <Link to="/home">
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                  Sign In
                </button>
              </Link>
            </div>
            <div className="text-center text-sm text-gray-600">
              <Link to="/signup"
                className="text-indigo-600 hover:underline font-medium"
              >
                ลงทะเบียน
              </Link>
              หากไม่มีบัญชี
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
