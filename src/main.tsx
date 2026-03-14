import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import Login from "./pages/auth/signInPage";
import Signup from "./pages/auth/signUpPage";
import App from "./App";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Payment from "./pages/user/Payment";
import CategoryPage from "./pages/user/Category";
import FAQPage from "./pages/user/Faq";
import Orders from "./pages/user/Orders";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVerification from "./pages/admin/AdminVerification";
import AdminProductApproval from "./pages/admin/AdminProductApproval";
import AdminUsers from "./pages/admin/AdminUsers";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerInventory from "./pages/seller/SellerInventory";
import SellerOrders from "./pages/seller/SellerOrders";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  { path: "/admindashboard", element: <AdminDashboard /> },
  { path: "/adminverification", element: <AdminVerification /> },
  { path: "/adminproductapproval", element: <AdminProductApproval /> },
  { path: "/adminusers", element: <AdminUsers /> },

  { path: "/sellerdashboard", element: <SellerDashboard /> },
  { path: "/sellerInventory", element: <SellerInventory /> },
  { path: "/sellerorders", element: <SellerOrders /> },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/category",
    element: <CategoryPage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },

  {
    path: "/payment",
    element: <Payment />,
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
