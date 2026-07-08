import Loader from "@/components/common/Loader";
import CustomToast from "@/components/common/toastify";
import LeaderBoardReportService from "@/services/api/LeaderBoardReport";
import LogService from "@/services/api/LogService";
import { useEffect, useState } from "react";
import {
    Trophy,
    Calendar,
    ShoppingBag,
    User,
    Award,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TrueFocus from "@/components/TrueFocus";
import { GiDiamondTrophy } from "react-icons/gi";
import { RiMedalFill } from "react-icons/ri";

const AdminLeaderBoard = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchData = async (params = {}) => {
        try {
            setIsLoading(true);
            const response = await LeaderBoardReportService.fetchLeaderBoardReport(params);
            if (response && response.statusCode === 200) {
                setData(response.data.leaderBoardData || []);
                setStats(response.data.summaryInfo || {});
                return;
            }
            CustomToast.ErrorToast(
                response.message ?? "An Error In Fetching Leader Board Report Data!"
            );
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AdminLeaderBoard",
                "method": "fetchData()",
                "errorMsg": error.message || "Admin LeaderBoard Report failed"
            });
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCustomDateSubmit = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            fetchData({ startDate, endDate });
        } else {
            CustomToast.ErrorToast("Please select both start and end dates");
        }
    };

    const getRankBadge = (rank) => {
        if (rank === 1) {
            return (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-orange-300 flex items-center justify-center shadow-lg">
                    <Trophy className="w-5 h-5 text-white" />
                </div>
            );
        } else if (rank === 2) {
            return (
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-600 to-purple-950 flex items-center justify-center shadow-md">
                    {/* <span className="text-white font-bold">2</span> */}
                    <GiDiamondTrophy className="w-5 h-5 text-white" />
                </div>
            );
        } else if (rank === 3) {
            return (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-blue-950 flex items-center justify-center shadow-md">
                    {/* <span className="text-white font-bold">3</span> */}
                    <RiMedalFill className="w-5 h-5 text-white" />
                </div>
            );
        }
        return (
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-gray-500 to-gray-800 flex items-center justify-center">
                <span className="text-white font-semibold">{rank}</span>
            </div>
        );
    };

    const renderStatsCards = ({ name, value, icon, iconBgColor }) => {
        return (
            name && value && icon && iconBgColor &&
            <div className="bg-linear-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-blue-200/50 hover:shadow-2xl transition-shadow duration-300" key={name}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">{name}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {value.toLocaleString()}
                        </p>
                    </div>
                    <div className={`p-3 bg-linear-to-br from-${iconBgColor}-100 to-${iconBgColor}-200 rounded-xl`}>
                        {icon}
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <Loader fullscreen={true} message="Loading leaderboard..." />
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex gap-6 items-center">
                    <div className="bg-linear-to-br from-orange-400 to-orange-600 rounded-2xl p-4 shadow-xl my-4">
                        <Trophy size={80} className="text-white" />
                    </div>
                    <TrueFocus
                        sentence="Sales LeaderBoard"
                        manualMode={false}
                        blurAmount={5}
                        borderColor="red"
                        animationDuration={1}
                        pauseBetweenAnimations={1}
                    />
                </div>

                {stats && Object.keys(stats).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 m-8">
                        {
                            [
                                renderStatsCards({
                                    name: "Top Sales",
                                    value: stats.topSale,
                                    icon: <Award className="w-6 h-6 text-blue-600" />,
                                    iconBgColor: "blue"
                                }),
                                renderStatsCards({
                                    name: "Total Orders",
                                    value: stats.totalOrders,
                                    icon: < ShoppingBag className="w-6 h-6 text-green-600" />,
                                    iconBgColor: "green"
                                }),
                                renderStatsCards({
                                    name: "Participants",
                                    value: stats.participants,
                                    icon: < User className="w-6 h-6 text-purple-600" />,
                                    iconBgColor: "purple"
                                }),
                                renderStatsCards({
                                    name: "Total Sales",
                                    value: stats.totalSales,
                                    icon: < BarChart3 className="w-6 h-6 text-emerald-600" />,
                                    iconBgColor: "emerald"
                                })
                            ]
                        }

                    </div>
                )}

                {/* Filter Section */}
                <div className="my-8 p-6 bg-linear-to-br from-white to-gray-100 rounded-2xl shadow-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Start Date Picker */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <p className="text-xs text-gray-500">Select the beginning date</p>
                                </div>
                            </div>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md"
                            />
                            {startDate && (
                                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                    Selected: {new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            )}
                        </div>

                        {/* End Date Picker */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <p className="text-xs text-gray-500">Select the ending date</p>
                                </div>
                            </div>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md"
                            />
                            {endDate && (
                                <div className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                                    Selected: {new Date(endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            onClick={handleCustomDateSubmit}
                            disabled={!startDate || !endDate}
                            className={`rounded-lg px-4 cursor-pointer ${startDate && endDate
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Apply Filter
                        </Button>

                        <Button
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                                fetchData();
                            }}
                            className="rounded-lg px-4 cursor-pointer bg-gray-600 text-white"
                        >
                            Clear Dates
                        </Button>
                    </div>
                </div>

                {/* Table Container*/}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-8 overflow-x-auto">
                    {/* Table Header*/}
                    <div className="min-w-xl bg-linear-to-r from-gray-900 to-gray-800 p-6">
                        <div className="grid grid-cols-12 gap-4 text-white font-bold">
                            <div className="col-span-2 flex items-center justify-center gap-2">
                                RANK
                            </div>
                            <div className="col-span-3 flex items-center gap-2">
                                SALES REP
                            </div>
                            <div className="col-span-2 flex items-center justify-center gap-2">
                                ORDERS
                            </div>
                            <div className="col-span-3 flex items-center justify-center gap-2">
                                TOTAL SALES
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="min-w-xl divide-y divide-gray-200">
                        {data && data.length > 0 ? (
                            data.map((ele, index) => (
                                <div
                                    key={ele._id}
                                    className={`p-6 transition-all duration-300 hover:bg-gray-50 ${index < 3 ? 'bg-linear-to-r from-gray-50 to-white' : ''}`}
                                >
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Rank Column */}
                                        <div className="col-span-2 flex justify-center">
                                            <div className="flex items-center gap-3">
                                                {getRankBadge(ele.rank)}
                                            </div>
                                        </div>

                                        {/* Sales Rep Column */}
                                        <div className="col-span-3">
                                            <h3 className="text-lg font-bold text-gray-900 truncate" title={ele.userName || 'Unknown'}>
                                                {ele.userName || 'Unknown'}
                                            </h3>
                                        </div>

                                        {/* Orders Column */}
                                        <div className="col-span-2 text-center">
                                            <span className="text-lg font-bold text-gray-900">
                                                {ele.orderCount}
                                            </span>
                                        </div>

                                        {/* Total Sales Column */}
                                        <div className="col-span-3 text-center">
                                            <span className="text-lg font-bold text-gray-900">
                                                {Number(ele.totalAmount).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Trophy className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
                                <p className="text-gray-500">No leaderboard data found for the selected period</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminLeaderBoard;