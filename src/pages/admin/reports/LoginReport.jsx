import AdminHeader from '@/components/common/AdminHeader'
import Loader from '@/components/common/Loader';
import CustomToast from '@/components/common/toastify';
import LoginHistoryReportService from '@/services/api/LoginHistoryReports';
import LogService from '@/services/api/LogService';
import React, { useEffect, useState } from 'react'

const AdminLoginReport = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    // Filters
    const [roleFilter, setRoleFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await LoginHistoryReportService.fetchLoginHistoryReport({ reportType: "user-summary" });
            if (response && response.statusCode === 200) {
                setData(response.data || []);
                setFilteredData(response.data || []);
                return;
            }
            CustomToast.ErrorToast(
                response.message ?? "An Error In Fetching Login Report Data!"
            );
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AdminLoginReport",
                "method": "fetchData()",
                "errorMsg": error.message || "Admin Login Report failed"
            });
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Apply filters whenever roleFilter or nameFilter changes
    useEffect(() => {
        let temp = [...data];

        if (roleFilter) {
            temp = temp.filter(ele => ele.userRole.toLowerCase() === roleFilter.toLowerCase());
        }
        if (nameFilter) {
            temp = temp.filter(ele => ele.userName.toLowerCase().includes(nameFilter.toLowerCase()));
        }

        setFilteredData(temp);
    }, [roleFilter, nameFilter, data]);

    if (isLoading) {
        return <Loader fullscreen={false} message='Collecting Report Data..' />
    }

    return (
        <div className='min-h-screen p-8'>
            <AdminHeader />
            <h1 className='text-2xl font-semibold py-4'>Login Report</h1>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Filter by Username"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="salesrep">Sales Rep</option>
                </select>
            </div>

            {/* Table Section */}
            {filteredData && filteredData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full sm:min-w-1/2 bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-center">User Name</th>
                                <th className="py-3 px-4 text-center">User Role</th>
                                <th className="py-3 px-4 text-center">First Login</th>
                                <th className="py-3 px-4 text-center">Last Login</th>
                                <th className="py-3 px-4 text-center">Total Login</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((ele) => (
                                <tr key={ele.userID} className="border-t hover:bg-gray-200 cursor-pointer transition">
                                    <td className="py-2 px-4">{ele.userName}</td>
                                    <td className="py-2 px-4">{ele.userRole}</td>
                                    <td className="py-2 px-4">{new Date(ele.firstLogin).toLocaleString()}</td>
                                    <td className="py-2 px-4">{new Date(ele.lastLogin).toLocaleString()}</td>
                                    <td className="py-2 px-4">{ele.totalLogins}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h1>No Data Found</h1>
            )}
        </div>
    )
}

export default AdminLoginReport;