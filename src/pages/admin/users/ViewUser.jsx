import Loader from '@/components/common/Loader';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import UserService from '@/services/api/UserService';
import UserDetailDialog from '@/components/common/UserDetailDialog';
import LogService from '@/services/api/LogService';

const ViewUser = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await UserService.fetchUser();
            setUsers(response.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "ViewUser",
                "method": "fetchUsers()",
                "errorMsg": error.message || "User Fetch failed"
            });
            console.log(`Error : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleClick = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    // Filter User by name or userName
    const filteredUsers = users.filter((u) => {
        const query = searchQuery.toLowerCase();
        return (
            u.name?.toLowerCase().includes(query) ||
            u.userName?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
                    View Users
                </h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or userName..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {isLoading ? (
                    <Loader fullscreen />
                ) : filteredUsers.length === 0 ? (
                    <p className="text-center text-red-500 font-semibold mt-10">
                        🚫 No Users found matching your search.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredUsers.map((user) => (
                            <Card
                                key={user._id}
                                onClick={() => handleClick(user)}
                                className="cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
                            >
                                <CardHeader>
                                    <CardTitle className="text-blue-600">
                                        Name : {user.name ?? 'N/A'}
                                    </CardTitle>
                                    <CardDescription>
                                        User Name: {user.userName ?? 'N/A'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-row justify-start">
                                    <div className='font-semibold'>
                                        <p>Role</p>
                                        <p>Status</p>
                                    </div>
                                    <div className='text-gray-700 px-4'>
                                        <p>{user.role ?? 'N/A'}</p>
                                        <p className={`${user.statusID === 1 ? "text-green-600" : "text-red-600"}`}>{user.statusID === 1 ? "Active" : "Inactive" ?? 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Dialog */}
                <UserDetailDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    user={selectedUser}
                />
            </div>
        </div>
    );
};

export default ViewUser;