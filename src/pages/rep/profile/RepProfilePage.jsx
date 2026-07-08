import Loader from "@/components/common/Loader";
import RepHeader from "@/components/common/RepHeader";
import TiltedCard from "@/components/TiltedCard";
import { Button } from "@/components/ui/button";
import usePreventBack from "@/hooks/usePreventBack";
import LogService from "@/services/api/LogService";
import UserService from "@/services/api/UserService";
import { clearAuthSession } from "@/store/slice/userSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RepProfilePage = () => {
    usePreventBack();
    const navigate = useNavigate();
    const userID = useSelector((state) => state.userInfo.loggedUserID);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const userResponse = await UserService.fetchUser({ id: userID });
            setUserInfo(userResponse.data || {});
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "RepProfilePage",
                "method": "fetchData()",
                "errorMsg": error.message || "Rep Profile failed"
            });
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userID) fetchData();
    }, [userID]);

    // Logout handler
    const handleLogout = () => {
        dispatch(clearAuthSession());
        navigate("/auth/login");
    };

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <div className="relative">
                {/* Enhanced Banner */}
                <div className="relative h-80 bg-linear-to-t from-gray-900 to-gray-950 overflow-hidden">
                    <RepHeader />
                </div>

                {/* Profile Image Card */}
                {userInfo && (
                    <div className="absolute left-16 top-40 z-10">
                        <TiltedCard
                            imageSrc={userInfo?.profileImage ?? "https://picsum.photos/200/300"}
                            altText="Profile Image"
                            captionText={userInfo?.name ?? "User Name"}
                            containerHeight="300px"
                            containerWidth="300px"
                            imageHeight="300px"
                            imageWidth="300px"
                            rotateAmplitude={8}
                            scaleOnHover={1.05}
                            showMobileWarning={false}
                            showTooltip={false}
                            displayOverlayContent={false}
                        />
                    </div>
                )}

                {/* Beautiful Logout Button */}
                <div className="m-4 flex justify-end">
                    <Button
                        onClick={handleLogout}
                        className="bg-gray-950 text-white font-semibold rounded-xl shadow-lg 
                                   hover:shadow-xl hover:bg-gray-900 hover:scale-105 transition-all duration-300 
                                   px-6 py-2 cursor-pointer"
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <Loader fullscreen />
            ) : (
                <div className="relative z-10 pt-0 pb-12 px-4 max-w-2xl mx-auto">
                    {userInfo && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {userInfo.name}
                                </h1>
                                <p className="text-blue-600 font-medium">{userInfo.role}</p>
                            </div>

                            {/* Profile Information Card */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Username */}
                                        <div className="group">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                    Username
                                                </label>
                                            </div>
                                            <p className="text-lg text-gray-800 font-medium pl-5">
                                                {userInfo.userName}
                                            </p>
                                        </div>

                                        {/* Role */}
                                        <div className="group">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                    Role
                                                </label>
                                            </div>
                                            <p className="text-lg text-gray-800 font-medium pl-5">
                                                {userInfo.role}
                                            </p>
                                        </div>

                                        {/* Address */}
                                        <div className="group md:col-span-2">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                    Address
                                                </label>
                                            </div>
                                            <p className="text-lg text-gray-800 font-medium pl-5">
                                                {userInfo.address}
                                            </p>
                                        </div>

                                        {/* Phone Number */}
                                        <div className="group md:col-span-2">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                    Phone Number
                                                </label>
                                            </div>
                                            <p className="text-lg text-gray-800 font-medium pl-5">
                                                {userInfo.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="bg-linear-to-r from-gray-50 to-blue-50/50 px-8 py-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Profile Information</span>
                                        <span className={`text-xs ${userInfo.statusID === 1 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"} px-2 py-1 rounded-full`}>
                                            {userInfo.statusID === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RepProfilePage;