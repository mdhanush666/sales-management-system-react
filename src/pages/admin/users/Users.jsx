import FeatureCard from "../common/FeatureCard";
import { LuUserPen, LuUserRoundPlus, LuUserRoundSearch } from "react-icons/lu";

import AdminHeader from "@/components/common/AdminHeader";
import { useEffect, useState } from "react";
import CheckPermission from "@/components/common/CheckPermission";


const Users = () => {

    const [permissions, setPermission] = useState({});

    const fetchPermission = async () => {
        const response = await CheckPermission.Check();
        setPermission(response);
    }

    useEffect(() => {
        fetchPermission();
    }, []);

    const features = [
        { feature: "Add User", icon: <LuUserRoundPlus />, to: "/admin/user/add-user", accessName: "Create", key: "users" },
        { feature: "View User", icon: <LuUserRoundSearch />, to: "/admin/user/view-user", accessName: "Read", key: "users" },
        { feature: "Update User", icon: <LuUserPen />, to: "/admin/user/update-user", accessName: "Update", key: "users" },
    ];

    return (
        <div className="min-h-screen max-h-screen p-8">
            <AdminHeader />

            <h1 className="text-3xl font-extralight mb-8">Users</h1>

            <FeatureCard features={features} permissions={permissions}/>
        </div>
    )
}

export default Users
