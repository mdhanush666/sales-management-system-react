import AdminHeader from "@/components/common/AdminHeader";
import Loader from "@/components/common/Loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogService from "@/services/api/LogService";
import { useEffect, useState } from "react";
import { AlertCircle, Clock, Code, User } from "lucide-react";

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // search queries
    const [searchUser, setSearchUser] = useState("");
    const [searchRole, setSearchRole] = useState("");

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const logResponse = await LogService.fetchLogs();
            setLogs(logResponse.data || []);
        } catch (error) {
            await LogService.createLog({
                userID: localStorage.getItem("loggedUserID"),
                ui: "AdminLogs",
                method: "fetchLogs()",
                errorMsg: error.message || "Admin Logs failed",
            });
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    if (isLoading) {
        return <Loader message="Fetching logs..." fullscreen />;
    }

    const filteredLogs = logs.filter((log) => {
        const matchUser = searchUser
            ? log.userID?.name.toLowerCase().includes(searchUser.toLowerCase())
            : true;
        const matchRole = searchRole
            ? log.userID?.role.toLowerCase().includes(searchRole.toLowerCase())
            : true;
        return matchUser && matchRole;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mb-4">
                <AdminHeader />
            </div>

            <h1 className="text-3xl font-semibold text-gray-800 mb-6">System Logs</h1>

            {/* Search Inputs */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Search by User</label>
                    <input
                        type="text"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        placeholder="Type user name..."
                        className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Search by Role</label>
                    <input
                        type="text"
                        value={searchRole}
                        onChange={(e) => setSearchRole(e.target.value)}
                        placeholder="Type role..."
                        className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:ring focus:ring-blue-200"
                    />
                </div>
            </div>

            {filteredLogs.length === 0 ? (
                <p className="text-gray-500">No logs match your search.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredLogs.map((log) => (
                        <Card
                            key={log._id}
                            className="shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="w-5 h-5 text-blue-600" />
                                    {log.userID.name}{" "}
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        {log.userID.role}
                                    </span>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-red-600 mt-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {log.errorMsg}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4 text-gray-500" />
                                        <span className="font-semibold">UI:</span>
                                        <span className="text-gray-600">{log.ui}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4 text-gray-500" />
                                        <span className="font-semibold">Method:</span>
                                        <span className="text-gray-600">{log.method}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="font-semibold">Created At:</span>
                                        <span className="text-gray-600">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminLogs;