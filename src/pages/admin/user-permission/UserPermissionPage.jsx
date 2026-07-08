import AdminHeader from '@/components/common/AdminHeader';
import { MdOutlineSecurity } from "react-icons/md";
import { GrShieldSecurity } from "react-icons/gr";
import FeatureCard from '../common/FeatureCard';
import { useEffect, useState } from 'react';
import CheckPermission from '@/components/common/CheckPermission';

const UserPermissionPage = () => {

    const [permissions, setPermission] = useState({});

    const fetchPermission = async () => {
        const response = await CheckPermission.Check();
        setPermission(response);
    }

    useEffect(() => {
        fetchPermission();
    }, []);

    const features = [
        { feature: "View User Permission", icon: <GrShieldSecurity />, to: "/admin/user-permission/view-permission", key: "userPermission", accessName: "Read" },
        { feature: "Set User Permission", icon: <MdOutlineSecurity />, to: "/admin/user-permission/set-permission", key: "userPermission", accessName: "Update" },
    ];

    return (
        <div className="min-h-screen p-8">
            <AdminHeader />

            <FeatureCard features={features} permissions={permissions} />
        </div>
    )
}

export default UserPermissionPage
