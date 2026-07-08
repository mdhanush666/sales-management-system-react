import Loader from '@/components/common/Loader';
import CustomToast from '@/components/common/toastify';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CategoryService from '@/services/api/CategoryService';
import LogService from '@/services/api/LogService';
import React, { useState } from 'react'
import { FaTag } from "react-icons/fa";

const AddCategory = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        category: "",
        statusID: 1,
    });

    const handleAddCategory = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await CategoryService.createCategory(formData);
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setFormData({
                    category: "",
                    statusID: 1,
                });
                return;
            } else {
                CustomToast.ErrorToast(response.message || "Update failed");
            }
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AddCategory",
                "method": "handleAddCategory()",
                "errorMsg": error.message || "Admin Add Category failed"
            });
            console.error("Error updating category:", error.message);
            CustomToast.ErrorToast("An error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (isLoading) {
        return <Loader message='Adding Category..' fullscreen />
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
            <div>
                <h1 className='text-4xl font-bold text-center mb-8 text-blue-700'>Add Category</h1>
            </div>
            <form className="space-y-4 my-6 w-full max-w-xl" onSubmit={handleAddCategory}>

                {/* Category */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaTag className="text-green-600" /> Category
                    </Label>
                    <Input
                        value={formData.name}
                        name="category"
                        autoComplete="off"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Register Button */}
                <div className="text-right">
                    <button className='bg-blue-500 my-4 w-full text-white p-2 rounded-lg hover:scale-105 transition-transform duration-300'>
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddCategory
