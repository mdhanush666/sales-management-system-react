import Loader from '@/components/common/Loader';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import CustomToast from '@/components/common/toastify';
import CategoryService from '@/services/api/CategoryService';
import CategoryDetailDialog from '@/components/common/CategoryDetailDialog';

const UpdateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await CategoryService.fetchCategories();
            setCategories(response.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AddCategory",
                "method": "fetchCategories()",
                "errorMsg": error.message || "Admin Update Category failed"
            });
            console.log(`Error : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleClick = (category) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

    // Filter Category by name
    const filteredCategories = categories.filter((c) => {
        const query = searchQuery.toLowerCase();
        return (
            c.category?.toLowerCase().includes(query)
        );
    });

    const handleCategoryUpdate = async (id, body) => {
        try {
            setIsLoading(true);
            const response = await CategoryService.updateCategory({ id, body });
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setIsDialogOpen(false);
                fetchCategories();
                return;
            } else {
                CustomToast.ErrorToast(response.message || "Update failed");
            }
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "UpdateCategory",
                "method": "handleCategoryUpdate()",
                "errorMsg": error.message || "Admin Update Category failed"
            });
            console.error("Error updating category:", error.message);
            CustomToast.ErrorToast("An error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
                    Update Category
                </h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by ccategory name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {isLoading ? (
                    <Loader fullscreen />
                ) : filteredCategories.length === 0 ? (
                    <p className="text-center text-red-500 font-semibold mt-10">
                        🚫 No Categories found matching your search.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCategories.map((category) => (
                            <Card
                                key={category._id}
                                onClick={() => handleClick(category)}
                                className="cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
                            >
                                <CardHeader>
                                    <CardTitle className="text-blue-600">
                                        Category : {category.category ?? 'N/A'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-row justify-start">
                                    <div className='font-semibold'>
                                        <p>Status</p>
                                    </div>
                                    <div className='text-gray-700 px-4'>
                                        <p className={`${category.statusID === 1 ? "text-green-600" : "text-red-600"}`}>{category.statusID === 1 ? "Active" : "Inactive" ?? 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Dialog */}
                <CategoryDetailDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    category={selectedCategory}
                    isUpdate={true}
                    onUpdate={handleCategoryUpdate}
                />
            </div>
        </div>
    );
};

export default UpdateCategory;