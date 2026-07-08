import FeatureCard from "../common/FeatureCard";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { FaListOl } from "react-icons/fa";

import AdminHeader from "@/components/common/AdminHeader";
import { useEffect, useState } from "react";
import CheckPermission from "@/components/common/CheckPermission";


const Products = () => {

    const [permissions, setPermission] = useState({});

    const fetchPermission = async () => {
        const response = await CheckPermission.Check();
        setPermission(response);
    }

    useEffect(() => {
        fetchPermission();
    }, []);

    const features = [
        { feature: "Add Products", icon: <MdOutlineAddShoppingCart />, to: "/admin/products/add-product", key: "products", accessName: "Create" },
        { feature: "View Products", icon: <FaListOl />, to: "/admin/products/view-product", key: "products", accessName: "Read" },
        { feature: "Update Products", icon: <GrUpdate />, to: "/admin/products/update-product", key: "products", accessName: "Update" },
    ];

    return (
        <div className="min-h-screen max-h-screen p-8">
            <AdminHeader />

            <h1 className="text-3xl font-extralight mb-8">Products</h1>

            <FeatureCard features={features} permissions={permissions} />
        </div>
    )
}

export default Products
