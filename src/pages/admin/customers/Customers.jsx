import FeatureCard from "../common/FeatureCard";
import { MdPeopleAlt } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import AdminHeader from "@/components/common/AdminHeader";
import { useEffect, useState } from "react";
import CheckPermission from "@/components/common/CheckPermission";


const AdminCustomers = () => {

    const [permissions, setPermission] = useState({});

    const fetchPermission = async () => {
        const response = await CheckPermission.Check();
        setPermission(response);
    }

    useEffect(() => {
        fetchPermission();
    }, []);

    const features = [
        { feature: "Confirmed Customers", icon: <MdPeopleAlt />, to: "/admin/customers/confirmed-customers", key: "customers", accessName: "Read" },
        { feature: "Temporary Customers", icon: <GoPeople />, to: "/admin/customers/temporary-customers", key: "customers", accessName: "Update" },
    ];

    return (
        <div className="min-h-screen p-8">
            <AdminHeader />

            <FeatureCard features={features} permissions={permissions} />
        </div>
    )
}

export default AdminCustomers
