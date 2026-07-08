import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaClipboardList, FaUserClock, FaChartLine, FaUsers } from "react-icons/fa";
import usePreventBack from "@/hooks/usePreventBack";
import RepHeader from "@/components/common/RepHeader";

const SalesHubPage = () => {
    usePreventBack();
    const navigate = useNavigate();

    const modules = [
        {
            title: "LeadBoard",
            description: "Your current performance rank among reps",
            icon: <FaChartLine size={40} className="text-purple-600" />,
            onClick: () => navigate("/rep/sales-hub/rep-leaderboard"),
        },
        {
            title: "Customers",
            description: "Browse your assigned customers",
            icon: <FaUserFriends size={40} className="text-green-500" />,
            onClick: () => navigate("/rep/sales-hub/customers"),
        },
        {
            title: "Temporary Customers",
            description: "Add, update, or view temporary customers",
            icon: <FaUsers size={40} className="text-yellow-500" />,
            onClick: () => navigate("/rep/sales-hub/temporary-customers"),
        },
        {
            title: "Orders",
            description: "View all orders placed by your customers",
            icon: <FaClipboardList size={40} className="text-red-500" />,
            onClick: () => navigate("/rep/sales-hub/orders"),
        },
        {
            title: "Login History",
            description: "View your login activity and timestamps",
            icon: <FaUserClock size={40} className="text-blue-500" />,
            onClick: () => navigate("/rep/sales-hub/login-histories"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Sales Hub</h1>
            <RepHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod, index) => (
                    <div
                        key={index}
                        onClick={mod.onClick}
                        className="cursor-pointer bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 hover:scale-[1.05]"
                    >
                        <div className="flex items-center space-x-4">
                            {mod.icon}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">{mod.title}</h2>
                                <p className="text-sm text-gray-500">{mod.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesHubPage;