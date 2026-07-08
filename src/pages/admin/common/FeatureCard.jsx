import { hasAccess } from '@/utils/permissionUtil';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ features, permissions }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((item, index) => {
                const allowed = item.key === "profile" || hasAccess(permissions, item.key, item.accessName);

                return (
                    <div
                        key={index}
                        onClick={() => allowed && navigate(item.to)}
                        className={`flex flex-col items-center justify-center rounded-xl shadow-lg p-6 border transition duration-300
              ${allowed
                                ? "bg-white cursor-pointer hover:scale-105 hover:shadow-2xl"
                                : "bg-gray-200 cursor-not-allowed opacity-50"}`}
                    >
                        <div className="text-4xl text-blue-500 mb-4">{item.icon}</div>
                        <p className="text-lg font-semibold text-gray-700">{item.feature}</p>
                        {!allowed && <p className="text-xs text-red-500 mt-2">No Access</p>}
                    </div>
                );
            })}
        </div>
    );
};

export default FeatureCard;