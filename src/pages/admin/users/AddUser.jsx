import Loader from '@/components/common/Loader';
import CustomToast from '@/components/common/toastify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserService from '@/services/api/UserService';
import React, { useState } from 'react';
import {
    FaTag,
    FaHome,
    FaPhone,
    FaUser,
    FaLock,
    FaUserShield,
    FaToggleOn,
} from "react-icons/fa";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LogService from '@/services/api/LogService';

const AddUser = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        userName: "",
        password: "",
        role: "admin",
        statusID: 1
    });

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await UserService.createUser(formData);
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setFormData({
                    name: "",
                    address: "",
                    phoneNumber: "",
                    userName: "",
                    password: "",
                    role: "admin",
                    statusID: 1,
                });
                return;
            } else {
                CustomToast.ErrorToast(response.message || "User creation failed");
            }
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AddUser",
                "method": "handleAddUser()",
                "errorMsg": error
            });
            CustomToast.ErrorToast("An error occurred during user creation.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return <Loader message='Adding User..' fullscreen />;
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
            <div>
                <h1 className='text-4xl font-bold text-center mb-8 text-blue-700'>Add User</h1>
            </div>
            <form className="space-y-4 my-6 w-full max-w-xl" onSubmit={handleAddUser}>

                {/* Name */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaTag className="text-green-600" /> Name
                    </Label>
                    <Input
                        value={formData.name}
                        name="name"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Address */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaHome className="text-blue-600" /> Address
                    </Label>
                    <Input
                        value={formData.address}
                        name="address"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Phone Number */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaPhone className="text-indigo-600" /> Phone Number
                    </Label>
                    <Input
                        value={formData.phoneNumber}
                        name="phoneNumber"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Username */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaUser className="text-purple-600" /> Username
                    </Label>
                    <Input
                        value={formData.userName}
                        name="userName"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaLock className="text-red-600" /> Password
                    </Label>
                    <Input
                        value={formData.password}
                        name="password"
                        type="password"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Role */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaUserShield className="text-yellow-600" /> Role
                    </Label>
                    <RadioGroup
                        value={formData.role}
                        onValueChange={(val) => setFormData({ ...formData, role: val })}
                        className="flex space-x-6"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="admin" id="role-admin" />
                            <Label htmlFor="role-admin">Admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="salesRep" id="role-rep" />
                            <Label htmlFor="role-rep">Sales Rep</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Status */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaToggleOn className="text-teal-600" /> Status
                    </Label>
                    <RadioGroup
                        value={formData.statusID?.toString() || "1"}
                        onValueChange={(val) =>
                            setFormData({ ...formData, statusID: Number(val) })
                        }
                        className="flex space-x-6"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="status-active" />
                            <Label htmlFor="status-active">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="status-inactive" />
                            <Label htmlFor="status-inactive">Inactive</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Register Button */}
                <div className="text-right">
                    <button className='bg-blue-500 my-4 text-white p-2 rounded-lg hover:scale-105 transition-transform duration-300'>
                        Register User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;