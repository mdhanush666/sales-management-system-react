import AdminHeader from "@/components/common/AdminHeader";
import { TbFileReport } from "react-icons/tb";
import { GiRank3 } from "react-icons/gi";
import FeatureCard from "../common/FeatureCard";


const AdminReportsPage = () => {

    const features = [
        { feature: "Login Report", icon: <TbFileReport />, to: "/admin/reports/loginReport", key: "loginReport", accessName: "Read" },
        { feature: "LeadBoard", icon: <GiRank3 />, to: "/admin/reports/leadBoard", key: "leadBoard", accessName: "Read" },
    ];

    const permisison = { "loginReport": { "Read": true }, "leadBoard": { "Read": true } };

    return (
        <div className="min-h-screen p-8">
            <AdminHeader />
            <FeatureCard features={features} permissions={permisison} />
        </div>
    )
}

export default AdminReportsPage
