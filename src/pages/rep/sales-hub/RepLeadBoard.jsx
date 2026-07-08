import Loader from "@/components/common/Loader";
import CustomToast from "@/components/common/toastify";
import LeaderBoardReportService from "@/services/api/LeaderBoardReport";
import LogService from "@/services/api/LogService";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import TrueFocus from "@/components/TrueFocus";
import { GiDiamondTrophy } from "react-icons/gi";
import { RiMedalFill } from "react-icons/ri";

const RepLeaderBoard = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
                "ui": "RepLeaderBoard",
                "method": "fetchData()",
                "errorMsg": error.message || "Rep LeaderBoard Report failed"
            });
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

export default RepLeaderBoard;