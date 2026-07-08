import AdminHeader from "@/components/common/AdminHeader";
import Loader from "@/components/common/Loader";
import GeoLocationMapDialog from "@/components/common/MapDialog";
import CustomToast from "@/components/common/toastify";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoginHistoryService from "@/services/api/LoginHistoriesService";
import LogService from "@/services/api/LogService";
import { useEffect, useState } from "react";

const AdminLoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [geoLocation, setGeoLocation] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLoginHistory = async () => {
    try {
      setIsLoading(true);
      const response = await LoginHistoryService.fetchLoginHistory({});
      if (response && response.statusCode == 200) {
        setLoginHistory(response.data || []);
        return;
      }
      CustomToast.ErrorToast(
        response.message ?? "An Error Fetching Login History!"
      );
    } catch (error) {
      await LogService.createLog({
        "userID": sessionStorage.getItem("loggedUserID"),
        "ui": "AdminLoginHistory",
        "method": "fetchLoginHistory()",
        "errorMsg": error.message || "Admin Login History failed"
      });
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const handleViewLocation = (data) => {
    setIsMapDialogOpen(true);
    setGeoLocation({
      lat: data.geoLocation.lat,
      lon: data.geoLocation.lon,
    });
  };

  const renderLoginHistoryCards = (data, index) => {
    return (
      <Card
        key={data._id}
        className="w-full max-w-md text-left rounded-xl p-6 border border-gray-200 shadow-lg 
                   bg-linear-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 
                   animate-fadeIn"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800">{data.userID?.name ?? "N/A"}</p>
          <p className="text-sm text-gray-500">{data.userID?.role ?? "N/A"}</p>
          <p className="text-sm text-gray-600 italic">
            {new Date(data.loginDate).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => handleViewLocation(data)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md 
                     hover:bg-blue-700 transition-colors duration-200"
        >
          📍 View Location
        </button>
      </Card>
    );
  };

  const filteredHistory = loginHistory && loginHistory.filter((item) => {
    const name = item.userID?.name?.toLowerCase() || "";
    const role = item.userID?.role?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || role.includes(query);
    // return (
    //   item.userID?.name?.toLowerCase().includes(query) ||
    //   item.userID?.role?.toLowerCase().includes(query)
    // );
  });


  if (isLoading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 text-center flex flex-col items-center p-6">
      <AdminHeader />
      <h1 className="text-3xl font-extrabold py-8 text-gray-800 tracking-wide">
        Login History
      </h1>

      <div className="min-w-full sm:min-w-1/2 mb-8">
        <Input
          type="text"
          placeholder="Search by User Name or role..."
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredHistory && filteredHistory.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredHistory.map((data, index) => renderLoginHistoryCards(data, index))}
        </div>
      ) : (
        <p className="text-gray-500 mt-12 text-lg">
          No login history found 🚫
        </p>
      )}

      <GeoLocationMapDialog
        isOpen={isMapDialogOpen}
        onClose={() => setIsMapDialogOpen(false)}
        lat={geoLocation.lat}
        lon={geoLocation.lon}
      />
    </div>
  );
};

export default AdminLoginHistory;