import Loader from '@/components/common/Loader';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import CategoryService from '@/services/api/CategoryService';
import LogService from '@/services/api/LogService';

const ViewCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await CategoryService.fetchCategories();
            setCategories(response.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "ViewCategory",
                "method": "fetchCategories()",
                "errorMsg": error.message || "Admin View Category failed"
            });
            console.log(`Error : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter Category by name
    const filteredCategories = categories.filter((c) => {
        const query = searchQuery.toLowerCase();
        return (
            c.category?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
                    View Categories
                </h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by category name..."
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
            </div>
        </div>
    );
};

export default ViewCategory;