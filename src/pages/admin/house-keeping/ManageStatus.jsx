import AdminHeader from '@/components/common/AdminHeader';
import Loader from '@/components/common/Loader';
import CustomToast from '@/components/common/toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LogService from '@/services/api/LogService';
import StatusService from '@/services/api/Status';
import React, { useEffect, useState } from 'react';

const ManageStatus = () => {
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        status: ''
    });

    const fetchStatus = async () => {
        setIsLoading(true);
        try {
            const statusResponse = await StatusService.fetchStatus();
            setStatus(statusResponse.data || []);
        } catch (error) {
            await LogService.createLog({
                userID: localStorage.getItem('loggedUserID'),
                ui: 'ManageStatus',
                method: 'fetchStatus()',
                errorMsg: error.message || 'Admin Manage Status failed'
            });
            console.error('Error fetching data:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStatus = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await StatusService.createStatus(formData);
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setFormData({
                    status: ''
                });
                fetchStatus();
                return;
            } else {
                CustomToast.ErrorToast(response.message || 'Add Status failed');
            }
        } catch (error) {
            await LogService.createLog({
                userID: localStorage.getItem('loggedUserID'),
                ui: 'Manage Status',
                method: 'handleAddStatus()',
                errorMsg: error.message || 'Admin Add Status failed'
            });
            console.error('Error updating status:', error);
            CustomToast.ErrorToast('An error occurred during create status.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader message="fetching status data.." fullscreen />;
    }

    return (
        <div className="min-h-screen p-4">
            <AdminHeader />

            {/* Form Section */}
            <div className="max-w-lg mx-auto my-6 bg-white shadow-md rounded-lg p-6">
                <form className="flex flex-col sm:flex-row gap-4 items-center justify-center" onSubmit={handleAddStatus}>
                    <div className="w-full sm:w-auto flex flex-col">
                        <Label htmlFor="status" className="mb-2 font-medium text-gray-700">
                            Status
                        </Label>
                        <div className='sm:flex block gap-2 sm:items-center'>
                            <Input
                                type="text"
                                name="status"
                                id="status"
                                required
                                value={formData.status}
                                onChange={handleChange}
                                autoComplete="off"
                                placeholder="Enter status"
                                className="w-full"
                            />
                            <Button className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto my-2">Add</Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Status Table */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Available Status</h1>

            {!status || status.length === 0 ? (
                <h1 className="text-center my-10 text-gray-500">No Status Found</h1>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full sm:min-w-1/2 bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Status ID</th>
                                <th className="py-3 px-4 text-left">Status Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status.map((s) => (
                                <tr key={s.statusID} className="border-t hover:bg-gray-200 cursor-pointer transition">
                                    <td className="py-2 px-4">{s.statusID}</td>
                                    <td className="py-2 px-4">{s.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageStatus;