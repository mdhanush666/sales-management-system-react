import AdminHeader from '@/components/common/AdminHeader'
import { FaMapLocationDot } from "react-icons/fa6";
import { IoHandRightSharp } from "react-icons/io5";
import FeatureCard from '../common/FeatureCard';
import CheckPermission from '@/components/common/CheckPermission';
import { useEffect, useState } from 'react';


const HouseKeeping = () => {

    const [permissions, setPermission] = useState({});

    const fetchPermission = async () => {
        const response = await CheckPermission.Check();
        setPermission(response);
    }

    useEffect(() => {
        fetchPermission();
    }, []);

    const features = [
        { feature: "Manage Status", icon: <IoHandRightSharp />, to: "/admin/house-keeping/manage-status", key: "houseKeeping", accessName: "Create" },
        { feature: "Feed Cities", icon: <FaMapLocationDot />, to: "/admin/house-keeping/feed-cities", key: "houseKeeping", accessName: "Create" },
    ];

    return (
        <div className="min-h-screen p-8">
            <AdminHeader />

            <FeatureCard features={features} permissions={permissions} />
        </div>
    )
}

export default HouseKeeping