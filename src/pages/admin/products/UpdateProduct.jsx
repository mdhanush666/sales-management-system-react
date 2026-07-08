import Loader from '@/components/common/Loader';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import ProductService from '@/services/api/ProductService';
import ProductDetailDialog from '@/components/common/ProductDetailDialog';
import CustomToast from '@/components/common/toastify';
import LogService from '@/services/api/LogService';

const UpdateProduct = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await ProductService.fetchProduct();
            setProducts(response.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "UpdateProduct",
                "method": "fetchProducts()",
                "errorMsg": error.message || "Admin Update Product failed"
            });
            console.log(`Error : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleClick = (product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    // Filter Product by modelNo, name, or category
    const filteredProducts = products.filter((p) => {
        const query = searchQuery.toLowerCase();
        return (
            p.modelNo?.toLowerCase().includes(query) ||
            p.name?.toLowerCase().includes(query) ||
            p.categoryID?.category?.toLowerCase().includes(query)
        );
    });

    const handleProductUpdate = async (id, body) => {
        try {
            setIsLoading(true);
            const response = await ProductService.updateProduct({ id, body });
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setIsDialogOpen(false);
                fetchProducts();
                return;
            } else {
                CustomToast.ErrorToast(response.message || "Update failed");
            }
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "UpdateProduct",
                "method": "handleProductUpdate()",
                "errorMsg": error.message || "Admin Update Product failed"
            });
            console.error("Error updating product:", error.message);
            CustomToast.ErrorToast("An error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
                    Update Products
                </h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by modelNo, name, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {isLoading ? (
                    <Loader fullscreen />
                ) : filteredProducts.length === 0 ? (
                    <p className="text-center text-red-500 font-semibold mt-10">
                        🚫 No Products found matching your search.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product._id}
                                onClick={() => handleClick(product)}
                                className="cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
                            >
                                <CardHeader>
                                    <CardTitle className="text-blue-600">
                                        Model No: {product.modelNo ?? 'N/A'}
                                    </CardTitle>
                                    <CardDescription>
                                        Name: {product.name ?? 'N/A'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-row justify-start">
                                    <div className='font-semibold'>
                                        <p>Description</p>
                                        <p>Category</p>
                                        <p>Price</p>
                                        <p>Status</p>
                                    </div>
                                    <div className='text-gray-700 px-4'>
                                        <p>{product.description ?? 'N/A'}</p>
                                        <p>{product.categoryID?.category ?? 'N/A'}</p>
                                        <p>{product.price ?? 'N/A'}</p>
                                        <p className={`${product.statusID === 1 ? "text-green-600" : "text-red-600"}`}>{product.statusID === 1 ? "Active" : "Inactive" ?? 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Dialog */}
                <ProductDetailDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    product={selectedProduct}
                    isUpdate={true}
                    onUpdate={handleProductUpdate}
                />
            </div>
        </div>
    );
};

export default UpdateProduct;