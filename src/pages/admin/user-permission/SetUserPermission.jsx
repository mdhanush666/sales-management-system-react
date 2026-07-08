import AdminHeader from '@/components/common/AdminHeader';
import PermissionNames from '../../../config/UserPermissionsData';
import { useEffect, useState } from 'react';
import LogService from '@/services/api/LogService';
import CustomToast from '@/components/common/toastify';
import UserService from '@/services/api/UserService';
import Loader from '@/components/common/Loader';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import UserPermissionService from '@/services/api/UserPermissionService';

const SetUserPermission = () => {
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
                ui: "SetUserPermission",
                method: "fetchUsers()",
                errorMsg: error.message || "Admin Set User Permission failed"
            });
            CustomToast.ErrorToast("An error occurred during Set User Permission.");
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
                const userPerm = response.data[0]; // one record per user
                const perms = userPerm.permissions || {};
                // Build state object keyed by permission name
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
                // No permissions yet → initialize empty state
                const state = {};
                PermissionNames.forEach(name => {
                    state[name] = { Create: false, Read: false, Update: false, Delete: false };
                });
                setPermissionsState(state);
            }
        } catch (error) {
            await LogService.createLog({
                userID: sessionStorage.getItem("loggedUserID"),
                ui: "SetUserPermission",
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

    // When user changes, fetch their permissions
    function handleUserChange(e) {
        const selectedID = e.target.value;
        setSelectedUserID(selectedID);
        if (selectedID) {
            fetchUserPermissions(selectedID);
        }
    }

    // Toggle checkbox state
    const togglePermission = (permName, action) => {
        setPermissionsState(prev => ({
            ...prev,
            [permName]: {
                ...prev[permName],
                [action]: !prev[permName][action]
            }
        }));
    };

    // Save permissions
    const handlePermission = async () => {
        try {
            setIsLoading(true);
            const response = await UserPermissionService.updateUserPermission({
                userID: selectedUserID,
                assignedBy: sessionStorage.getItem("loggedUserID"),
                permissions: permissionsState
            });
            if (response.success) {
                CustomToast.SuccessToast(response.message);
            } else {
                CustomToast.ErrorToast(response.message ?? "Error Updating Permissions");
            }
        } catch (error) {
            await LogService.createLog({
                userID: sessionStorage.getItem("loggedUserID"),
                ui: "SetUserPermission",
                method: "handlePermission()",
                errorMsg: error.message || "Admin Handle Permission failed"
            });
            CustomToast.ErrorToast("An error occurred during Handle User Permission.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader message='fetching data...' fullscreen />;
    }

    return (
        <div className='min-h-screen p-6 bg-gray-100'>
            <AdminHeader />

            <h1 className='text-2xl font-semibold mb-4'>Set User Permission</h1>

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
                    <h2 className='text-xl font-light mb-2'>Permission Table</h2>
                    <table className="min-w-full sm:min-w-1/2 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
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
                                        <Checkbox
                                            checked={permissionsState[p]?.Create || false}
                                            onCheckedChange={() => togglePermission(p, "Create")}
                                            className="border border-black"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <Checkbox
                                            checked={permissionsState[p]?.Read || false}
                                            onCheckedChange={() => togglePermission(p, "Read")}
                                            className="border border-black"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <Checkbox
                                            checked={permissionsState[p]?.Update || false}
                                            onCheckedChange={() => togglePermission(p, "Update")}
                                            className="border border-black"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <Checkbox
                                            checked={permissionsState[p]?.Delete || false}
                                            onCheckedChange={() => togglePermission(p, "Delete")}
                                            className="border border-black"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button
                        className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
                        onClick={handlePermission}
                    >
                        Set Permission
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SetUserPermission;