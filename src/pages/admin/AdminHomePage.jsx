import {
    FaUsers,
    FaBox,
    FaTags,
    FaShoppingCart,
    FaChartBar,
    FaBroom,
    FaUserShield,
    FaUserCircle,
    FaUserFriends,
    FaHistory,
} from "react-icons/fa";
import { TbFaceIdError } from "react-icons/tb";
import AdminHeader from "@/components/common/AdminHeader";
import usePreventBack from "@/hooks/usePreventBack";
import FeatureCard from "./common/FeatureCard";
import CheckPermission from "@/components/common/CheckPermission";
import { useEffect, useState } from "react";

const AdminHomePage = () => {

    usePreventBack();

    const [permissions, setPermission] = useState({});

    const fetchPermission = async () => {
        const response = await CheckPermission.Check();
        setPermission(response);
    }

    useEffect(() => {
        fetchPermission();
    }, []);


    const features = [
        { feature: "Users", icon: <FaUserFriends />, to: "/admin/users", key: "users", accessName: "Read" },
        { feature: "Customers", icon: <FaUsers />, to: "/admin/customers", key: "customers", accessName: "Read" },
        { feature: "Products", icon: <FaBox />, to: "/admin/products", key: "products", accessName: "Read" },
        { feature: "Categories", icon: <FaTags />, to: "/admin/categories", key: "categories", accessName: "Read" },
        { feature: "Orders", icon: <FaShoppingCart />, to: "/admin/orders", key: "orders", accessName: "Read" },
        { feature: "Reports", icon: <FaChartBar />, to: "/admin/reports", key: "reports", accessName: "Read" },
        { feature: "Login History", icon: <FaHistory />, to: "/admin/login-history", key: "loginHistories", accessName: "Read" },
        { feature: "House Keeping", icon: <FaBroom />, to: "/admin/house-keeping", key: "houseKeeping", accessName: "Read" },
        { feature: "Logs", icon: <TbFaceIdError />, to: "/admin/logs", key: "logs", accessName: "Read" },
        { feature: "User Permission", icon: <FaUserShield />, to: "/admin/user-permission", key: "userPermission", accessName: "Read" },
        { feature: "Profile", icon: <FaUserCircle />, to: "/admin/profile", key: "profile", accessName: "Read" },
    ];
    return (
        <div className="min-h-screen p-8">
            <AdminHeader />

            <FeatureCard features={features} permissions={permissions} />
        </div>
    );
};

export default AdminHomePage;