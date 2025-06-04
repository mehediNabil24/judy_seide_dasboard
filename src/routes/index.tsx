import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardLayout from "../components/layouts/Dashboard";
// import UnderConstruction from "../components/others/underConstructions";
import SignInPage from "../components/pages/signIn/SignIn";
// import MainDashboard from "../components/pages/mainDashboard/MainDashboard";
import AdminDashboard from "../components/pages/adminDashboard/AdminDashBoard";
import { AdminNavLink, navLink } from "../components/layouts/Navlink";

import PrivateRoute from "./PrivateRoute";
import Hello from "../components/Hello";
import CategoryList from "../components/category/CategoryList";
import AddCategoryPage from "../components/category/AddCategory";
import ProductList from "../components/product/ProductList";
import ProductDetails from "../components/product/productDetailss";
import AddMaterial from "../components/material/AddMaterial";
import AddProduct from "../components/product/AddProduct";
import MaterialList from "../components/materialList/MaterialList";
import CustomerList from "../components/customer/CustomerList";
import OrderList from "../components/orders/OrderList";
import ReviewList from "../components/review/ReviewList";
import AdminProfile from "../components/admin/AdminProfile";
import BlogList from "../components/blog/BlogList";
import AddBlog from "../components/blog/AddBlog";
// import UserProfile from "../components/userProfile/userProfile";
import UserOrderList from "../components/orders/UserOrderList";
import UserOrderDetails from "../components/orders/UserOrderDetails";
import UserProfile from "../components/userProfile/UserProfile";



const RouterProvider: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />

        {/* BUSINESS ROLE ROUTES */}
        <Route element={<PrivateRoute allowedRoles={["USER"]} />}>
          <Route
            path="/dashboard"
            element={<DashboardLayout navLink={navLink} />}
          >
            <Route index element={<UserProfile />} />
            <Route path="order-list" element={< UserOrderList/>} />
            <Route path="order-list/:id" element={<UserOrderDetails />} />
            <Route path="add-service" element={<Hello/>} />
            <Route path="my-service" element={<Hello />} />
            <Route path="book-service" element={<Hello/>} />
            <Route path="cancel-service" element={<Hello />} />
            <Route path="shop-input" element={<Hello />} />
            <Route path="reviews" element={<Hello />} />
            <Route path="subscriptions" element={<Hello />} />
            <Route path="payment-method" element={<Hello/>} />
            <Route path="add-blog" element={<Hello />} />
            <Route path="business-blog" element={<Hello />} />
            <Route path="add-staff" element={<Hello />} />
            <Route path="all-staffs" element={<Hello />} />
            <Route path="user-payment" element={<Hello />} />
          </Route>
        </Route>

        {/* ADMIN ROLE ROUTES */}
        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path="/admin"
            element={<DashboardLayout navLink={AdminNavLink} />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="add-category" element={<AddCategoryPage />} />
            <Route path="category-list" element={<CategoryList />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="product-list/:id" element={<ProductDetails />} />
            <Route path="add-material" element={<AddMaterial />} />
            {/* <Route path="book-list/:id" element={<ProductDetails/>} /> */}
            <Route path="material-list" element={<MaterialList />} />
            <Route path="customer-list" element={<CustomerList />} />
            <Route path="order-list" element={<OrderList />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="all-blog" element={<BlogList />} />
            <Route path="blog-details" element={<Hello />} />
            <Route path="reviews" element={<ReviewList />} />
            <Route path="admin-profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterProvider;
