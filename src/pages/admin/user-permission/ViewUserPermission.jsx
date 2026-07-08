import { useEffect, useState } from 'react';
import AdminHeader from '@/components/common/AdminHeader';
import PermissionNames from '../../../config/UserPermissionsData';
import LogService from '@/services/api/LogService';
import CustomToast from '@/components/common/toastify';
import UserService from '@/services/api/UserService';
import Loader from '@/components/common/Loader';
import UserPermissionService from '@/services/api/UserPermissionService';

const ViewUserPermission = () => {
    const [users, setUsers] = useState([]);
    const [permissionsState, setPermissionsState] = useState({});
    const [selectedUserID, setSelectedUserID] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await UserService.fetchUser({ statusID: 1 });
            if (response && response.success) {
                setUsers(response.data || []);
            } else {
                CustomToast.ErrorToast(response ? response.message : "Error Fetching Users!");
            }
        } catch (error) {
            await LogService.createLog({
                userID: sessionStorage.getItem("loggedUserID"),
                ui: "ViewUserPermission",
                method: "fetchUsers()",
                errorMsg: error.message || "Admin View User Permission failed"
            });
            CustomToast.ErrorToast("An error occurred during Fetch Users.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch permissions for selected user
    const fetchUserPermissions = async (userID) => {
        try {
            setIsLoading(true);
            const response = await UserPermissionService.fetchUserPermission({ userID });
            if (response && response.success && response.data.length > 0) {
                const userPerm = response.data[0];
                const perms = userPerm.permissions || {};
                const state = {};
                PermissionNames.forEach(name => {
                    state[name] = {
                        Create: perms[name]?.Create || false,
                        Read: perms[name]?.Read || false,
                        Update: perms[name]?.Update || false,
                        Delete: perms[name]?.Delete || false
                    };
                });
                setPermissionsState(state);
            } else {
                const state = {};
                PermissionNames.forEach(name => {
                    state[name] = { Create: false, Read: false, Update: false, Delete: false };
                });
                setPermissionsState(state);
            }
        } catch (error) {
            await LogService.createLog({
                userID: sessionStorage.getItem("loggedUserID"),
                ui: "ViewUserPermission",
                method: "fetchUserPermissions()",
                errorMsg: error.message || "Admin Fetch User Permission failed"
            });
            CustomToast.ErrorToast("An error occurred during Fetch User Permission.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    function handleUserChange(e) {
        const selectedID = e.target.value;
        setSelectedUserID(selectedID);
        if (selectedID) {
            fetchUserPermissions(selectedID);
        }
    }

    if (isLoading) {
        return <Loader message='fetching data...' fullscreen />;
    }

    return (
        <div className='min-h-screen p-6 bg-gray-100'>
            <AdminHeader />

            <h1 className='text-2xl font-semibold mb-4 text-blue-700'>View User Permission</h1>

            <div className='flex gap-4 my-4 items-center'>
                <span className="font-medium">Select User :</span>
                <select
                    className='border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                    value={selectedUserID || ""}
                    onChange={handleUserChange}
                >
                    <option value={""}>Select User</option>
                    {users && users.map((user) => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                </select>
            </div>

            {!selectedUserID ? (
                <div className="mt-6 text-center text-gray-600 italic">
                    Please select a user to view permission table
                </div>
            ) : (
                <div className='my-6 overflow-x-auto space-y-4'>
                    <h2 className='text-xl font-light mb-2 text-gray-700'>Permission Table</h2>
                    <table className="min-w-full sm:min-w-1/2 bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className='bg-gray-100 text-gray-700'>
                            <tr>
                                <th className="px-4 py-2 text-left">Permission</th>
                                <th className="px-4 py-2">Create</th>
                                <th className="px-4 py-2">Read</th>
                                <th className="px-4 py-2">Update</th>
                                <th className="px-4 py-2">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PermissionNames && PermissionNames.map((p, idx) => (
                                <tr key={idx} className='border-t hover:bg-gray-50 transition duration-150'>
                                    <td className="px-4 py-2 font-medium">{p}</td>
                                    <td className="px-4 py-2 text-center">
                                        {permissionsState[p]?.Create ? "✅" : "❌"}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {permissionsState[p]?.Read ? "✅" : "❌"}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {permissionsState[p]?.Update ? "✅" : "❌"}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {permissionsState[p]?.Delete ? "✅" : "❌"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewUserPermission;