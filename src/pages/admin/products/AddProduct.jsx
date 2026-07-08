import Loader from '@/components/common/Loader';
import CustomToast from '@/components/common/toastify';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CategoryService from '@/services/api/CategoryService';
import LogService from '@/services/api/LogService';
import ProductService from '@/services/api/ProductService';
import React, { useEffect, useState } from 'react'
import {
    FaBarcode,
    FaTag,
    FaAlignLeft,
    FaListAlt,
    FaDollarSign
} from "react-icons/fa";
const AddProduct = () => {

    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        modelNo: "",
        price: "",
        categoryID: "",
        statusID: 1,
    });

    const fetchCategories = async () => {
        try {
            const response = await CategoryService.fetchCategories({ statusID: 1 });
            setCategory(response.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AddProduct",
                "method": "fetchCategories()",
                "errorMsg": error.message || "Admin Fetch Categories failed"
            });
            console.error("Error fetching categories:", error.message);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (formData.categoryID == "") {
            CustomToast.WarningToast("Category Can't Be Empty!");
            return;
        }
        try {
            setIsLoading(true);
            const response = await ProductService.createProduct(formData);
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setFormData({
                    name: "",
                    description: "",
                    modelNo: "",
                    price: "",
                    categoryID: "",
                    statusID: 1,
                });
                return;
            } else {
                CustomToast.ErrorToast(response.message || "Update failed");
            }
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AddProduct",
                "method": "handleAddProduct()",
                "errorMsg": error.message || "Admin Add Product failed"
            });
            console.error("Error updating product:", error.message);
            CustomToast.ErrorToast("An error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleCategoryChange = (e) => {
        const selectedID = e.target.value;
        setFormData({ ...formData, categoryID: selectedID });
    };

    if (isLoading) {
        return <Loader message='Adding Product..' fullscreen />
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
            <div>
                <h1 className='text-4xl font-bold text-center mb-8 text-blue-700'>Add Product</h1>
            </div>
            <form className="space-y-4 my-6 w-full max-w-xl" onSubmit={handleAddProduct}>

                {/* Model No */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaBarcode className="text-blue-600" /> Model No
                    </Label>
                    <Input
                        value={formData.contactNo}
                        name="modelNo"
                        autoComplete='off'
                        onChange={handleInputChange}
                        required
                    />
                </div>

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

                {/* description */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaAlignLeft className="text-red-600" /> Description
                    </Label>
                    <Input
                        value={formData.description}
                        name="description"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Price */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaDollarSign className="text-blue-600" /> Price
                    </Label>
                    <Input
                        value={formData.price}
                        type="number"
                        name="price"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Category Dropdown */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                        <FaListAlt className="text-purple-600" /> Category
                    </Label>
                    <select
                        className="border rounded-md p-2 bg-white"
                        value={formData.categoryID || ""}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select Category</option>
                        {category.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Register Button */}
                <div className="text-right">
                    <button className='bg-blue-500 my-4 text-white p-2 rounded-lg hover:scale-105 transition-transform duration-300'>
                        Register
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProduct
