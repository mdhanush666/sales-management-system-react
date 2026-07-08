import Loader from '@/components/common/Loader';
import ProductService from '@/services/api/ProductService';
import { useEffect, useState } from 'react';
import ProductCard from '../common/ProductCard';
import ProductDetailDialog from '../common/ProductDetailDialog';
import { useParams } from 'react-router-dom';
import RepHeader from '@/components/common/RepHeader';
import LogService from '@/services/api/LogService';

const CategoryProducts = () => {
    const { id } = useParams();
    const categoryID = id;

    const [products, setProducts] = useState(null);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const productResponse = await ProductService.fetchProduct({
                categoryID,
                statusID: 1,
            });
            setProducts(productResponse.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "CategoryProducts",
                "method": "fetchCategoryProduct()",
                "errorMsg": error.message || "Rep Category Product failed"
            });
            console.error('Error fetching category products : ', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProduct();
    }, [categoryID]);

    const handleProductClick = (product) => {
        setIsProductDialogOpen(true);
        setSelectedProduct(product);
    };

    if (loading) {
        return <Loader fullscreen />;
    }

    return (
        <div className="px-6 py-4">

            <h1 className="text-center text-3xl font-bold mt-12">Products</h1>

            <RepHeader />

            {/* Grid container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products &&
                    products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() => handleProductClick(product)}
                        />
                    ))}
            </div>
            <div className='h-screen w-full flex items-center justify-center'>
                {products != null && products.length === 0 ? <h1 className='text-[22px] text-center'>No Products Found!</h1> : null}
            </div>

            <ProductDetailDialog
                open={isProductDialogOpen}
                onOpenChange={setIsProductDialogOpen}
                productInfo={selectedProduct}
            />
        </div>
    );
};

export default CategoryProducts;