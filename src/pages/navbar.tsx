import { Link } from "react-router-dom";
import logo from "../assets/Logo_Welddefectspecimen.svg";

export default function Navbar() {
  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
        <a href="/home">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </a>

        <div className="hidden sm:flex items-center gap-8">
          <a
            href="/home"
            className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Home
          </a>
          <a
            href="#"
            className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Dashbord
          </a>
          <a
            href="#"
            className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            status
          </a>

          <div className="relative cursor-pointer">
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <button className="absolute -top-2 -right-3"></button>
          </div>
          <Link to="/login">
            <button className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="cursor-pointer px-8 py-2 bg-pink-500 hover:bg-pink-600 transition text-white rounded-full">
              Sign up
            </button>
          </Link>
        </div>
      </nav>
    </>
  );
}
