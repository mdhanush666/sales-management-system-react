import FeatureCard from "../common/FeatureCard";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { FaListOl } from "react-icons/fa";

import AdminHeader from "@/components/common/AdminHeader";
import CheckPermission from "@/components/common/CheckPermission";
import { useEffect, useState } from "react";


const Categories = () => {

    const [permissions, setPermission] = useState({});

    const fetchPermission = async () => {
        const response = await CheckPermission.Check();
        setPermission(response);
    }

    useEffect(() => {
        fetchPermission();
    }, []);

    const features = [
        { feature: "Add Category", icon: <MdOutlineAddShoppingCart />, to: "/admin/category/add-category", key: "categories", accessName: "Create" },
        { feature: "View Category", icon: <FaListOl />, to: "/admin/category/view-category", key: "categories", accessName: "Read" },
        { feature: "Update Category", icon: <GrUpdate />, to: "/admin/category/update-category", key: "categories", accessName: "Update" },
    ];

    return (
        <div className="min-h-screen p-8">
            <AdminHeader />

            <h1 className="text-3xl font-extralight mb-8">Categories</h1>

            <FeatureCard features={features} permissions={permissions} />
        </div>
    )
}

export default Categories
