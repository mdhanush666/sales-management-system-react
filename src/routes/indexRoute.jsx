import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Admin Pages
import AdminHomePage from "@/pages/admin/AdminHomePage";
import AddCategory from "@/pages/admin/categories/AddCategory";
import Categories from "@/pages/admin/categories/Category";
import UpdateCategory from "@/pages/admin/categories/UpdateCategory";
import ViewCategory from "@/pages/admin/categories/ViewCategory";
import ConfirmedCustomers from "@/pages/admin/customers/ConfirmedCustomers";
import AdminCustomers from "@/pages/admin/customers/Customers";
import AdminTemporaryCustomers from "@/pages/admin/customers/TemporaryCustomers";
import FeedCities from "@/pages/admin/house-keeping/FeedCities";
import HouseKeeping from "@/pages/admin/house-keeping/HouseKeeping";
import ManageStatus from "@/pages/admin/house-keeping/ManageStatus";
import AdminLoginHistory from "@/pages/admin/login-history/LoginHistory";
import AdminLogs from "@/pages/admin/logs/Logs";
import AdminOrders from "@/pages/admin/orders/Orders";
import AddProduct from "@/pages/admin/products/AddProduct";
import Products from "@/pages/admin/products/Products";
import UpdateProduct from "@/pages/admin/products/UpdateProduct";
import ViewProduct from "@/pages/admin/products/ViewProduct";
import AdminProfilePage from "@/pages/admin/profile/AdminProfilePage";
import AdminLeaderBoard from "@/pages/admin/reports/AdminLeaderBoard";
import AdminReportsPage from "@/pages/admin/reports/AdminReportsPage";
import AdminLoginReport from "@/pages/admin/reports/LoginReport";
import SetUserPermission from "@/pages/admin/user-permission/SetUserPermission";
import UserPermissionPage from "@/pages/admin/user-permission/UserPermissionPage";
import ViewUserPermission from "@/pages/admin/user-permission/ViewUserPermission";
import AddUser from "@/pages/admin/users/AddUser";
import UpdateUser from "@/pages/admin/users/UpdateUser";
import Users from "@/pages/admin/users/Users";
import ViewUser from "@/pages/admin/users/ViewUser";

// Auth & Common Pages
import LoginPage from "@/pages/auth/LoginPage";
import PageNotFound from "@/pages/common/PageNotFound";
import IndexPage from "@/pages/IndexPage";

// Rep Pages
import AboutUs from "@/pages/rep/AboutUs";
import RepCartPage from "@/pages/rep/cart/RepCartPage";
import ContactUs from "@/pages/rep/ContactUs";
import CategoryProducts from "@/pages/rep/home/CategoryProducts";
import RepHomePage from "@/pages/rep/home/RepHomePage";
import RepProfilePage from "@/pages/rep/profile/RepProfilePage";
import RepView from "@/pages/rep/RepView";
import RepCustomers from "@/pages/rep/sales-hub/Customers";
import RepLoginHistory from "@/pages/rep/sales-hub/LoginHistory";
import RepOrders from "@/pages/rep/sales-hub/Orders";
import RepLeaderBoard from "@/pages/rep/sales-hub/RepLeadBoard";
import SalesHubPage from "@/pages/rep/sales-hub/SalesHubPage";
import TemporaryCustomers from "@/pages/rep/sales-hub/TemporaryCustomers";

export const router = createBrowserRouter([
    // Public Open Routes
    {
        path: "/",
        element: <IndexPage />,
        errorElement: <PageNotFound />
    },
    {
        path: "/auth/login",
        element: <LoginPage />
    },
    {
        path: "/about-us",
        element: <AboutUs />
    },
    {
        path: "/contact",
        element: <ContactUs />
    },

    // ==========================================
    // PROTECTED ADMIN ROUTES 
    // ==========================================
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={['admin']} />, // Secures all routes within this children array
        children: [
            {
                path: "home", // resolves to /admin/home
                element: <AdminHomePage />
            },
            // Admin Customers...
            {
                path: "customers",
                element: <AdminCustomers />
            },
            {
                path: "customers/confirmed-customers",
                element: <ConfirmedCustomers />
            },
            {
                path: "customers/temporary-customers",
                element: <AdminTemporaryCustomers />
            },
            // Admin Users...
            {
                path: "users",
                element: <Users />
            },
            {
                path: "user/add-user",
                element: <AddUser />
            },
            {
                path: "user/view-user",
                element: <ViewUser />
            },
            {
                path: "user/update-user",
                element: <UpdateUser />
            },
            // Admin Products...
            {
                path: "products",
                element: <Products />
            },
            {
                path: "products/add-product",
                element: <AddProduct />
            },
            {
                path: "products/view-product",
                element: <ViewProduct />
            },
            {
                path: "products/update-product",
                element: <UpdateProduct />
            },
            // Admin Categories...
            {
                path: "categories",
                element: <Categories />
            },
            {
                path: "category/add-category",
                element: <AddCategory />
            },
            {
                path: "category/view-category",
                element: <ViewCategory />
            },
            {
                path: "category/update-category",
                element: <UpdateCategory />
            },
            // Admin Orders...
            {
                path: "orders",
                element: <AdminOrders />
            },
            // Admin Logs...
            {
                path: "logs",
                element: <AdminLogs />
            },
            // Admin Login History...
            {
                path: "login-history",
                element: <AdminLoginHistory />
            },
            // Admin House Keeping...
            {
                path: "house-keeping",
                element: <HouseKeeping />
            },
            {
                path: "house-keeping/manage-status",
                element: <ManageStatus />
            },
            {
                path: "house-keeping/feed-cities",
                element: <FeedCities />
            },
            // Admin Profile
            {
                path: "profile",
                element: <AdminProfilePage />
            },
            // Admin User-Permission
            {
                path: "user-permission",
                element: <UserPermissionPage />
            },
            {
                path: "user-permission/set-permission",
                element: <SetUserPermission />
            },
            {
                path: "user-permission/view-permission",
                element: <ViewUserPermission />
            },
            // Admin Reports
            {
                path: "reports",
                element: <AdminReportsPage />
            },
            {
                path: "reports/loginReport",
                element: <AdminLoginReport />
            },
            {
                path: "reports/leadBoard",
                element: <AdminLeaderBoard />
            },
        ]
    },

    // ==========================================
    // PROTECTED REP ROUTES
    // ==========================================
    {
        path: "/rep",
        element: <ProtectedRoute allowedRoles={['salesRep']} />, // Secures all routes within this layout component
        children: [
            {
                // We use RepView layout wrapper to map internal elements
                element: <RepView />,
                children: [
                    { path: "home", element: <RepHomePage /> },
                    { path: "home/products/categoryID/:id", element: <CategoryProducts /> },
                    { path: "sales-hub", element: <SalesHubPage /> },
                    { path: "sales-hub/customers", element: <RepCustomers /> },
                    { path: "sales-hub/rep-leaderboard", element: <RepLeaderBoard /> },
                    { path: "sales-hub/temporary-customers", element: <TemporaryCustomers /> },
                    { path: "sales-hub/login-histories", element: <RepLoginHistory /> },
                    { path: "sales-hub/orders", element: <RepOrders /> },
                    { path: "cart", element: <RepCartPage /> },
                    { path: "profile", element: <RepProfilePage /> },
                ]
            }
        ]
    },

    // Fallback Catch-All Route for non-existent paths
    {
        path: "*",
        element: <PageNotFound />
    }
]);