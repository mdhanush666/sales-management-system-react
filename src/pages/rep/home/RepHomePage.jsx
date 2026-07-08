import CustomerService from "@/services/api/CustomerService";
import CategoryService from "@/services/api/CategoryService";
import { useEffect, useState, useRef } from "react";
import Loader from "@/components/common/Loader";
import CustomerDropdown from "../common/CustomerDropdown";
import CategoryCard from "../common/CategoryCard";
import ProductService from "@/services/api/ProductService";
import ProductCard from "../common/ProductCard";
import RepHeader from "@/components/common/RepHeader";
import usePreventBack from "@/hooks/usePreventBack";
import ProductDetailDialog from "../common/ProductDetailDialog";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedCustomerID } from "@/store/slice/userSlice";
import LogService from "@/services/api/LogService";

const RepHomePage = () => {

    usePreventBack();

    const [customers, setCustomers] = useState(null);
    const [categories, setCategories] = useState(null);
    const [products, setProducts] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);


    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    let showProductSuggestion = useRef(false);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedCustomerID = useSelector(state => state.userInfo.selectedCustomerID);

    const loggedUserID = useSelector(state => state.userInfo.loggedUserID);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch Customers
            const customerResponse = await CustomerService.fetchCustomers({ salesRepID: loggedUserID });
            setCustomers(customerResponse.data || []);

            // Fetch Categories
            const categoryResponse = await CategoryService.fetchCategories({ statusID: 1 });
            setCategories(categoryResponse.data || []);

            // Fetch Products
            const productResponse = await ProductService.fetchProduct({ statusID: 1 });
            const allProducts = productResponse.data || [];
            setProducts(allProducts);
            setFilteredProducts(allProducts);

        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "RepHomePage",
                "method": "fetchAllData()",
                "errorMsg": error.message || "Rep Home Page failed"
            });
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        setSelectedCustomerId(selectedCustomerID)
    }, []);

    useEffect(() => {
        if (!products) return;

        const query = searchQuery.toLowerCase();
        const filtered = products.filter((product) => product.name?.toLowerCase().includes(query) || product.modelNo?.toLowerCase().includes(query));
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    // Handle category click
    const handleCategoryClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
        navigate(`products/categoryID/${categoryId}`);
    };

    // Handle Product click
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsProductDialogOpen(true);
    };

    const handleCustomerLogout = () => {
        dispatch(clearSelectedCustomerID());
        setSelectedCustomerId(null);
    }

    if (loading) {
        return <Loader fullscreen />;
    }

    return (
        <div className="min-h-screen p-4 space-y-4">

            <div>
                <RepHeader />
            </div>

            {/* Customer Dropdown */}
            <div className="w-full">
                Select Customer :
                <div className="flex flex-wrap items-center justify-start gap-2 p-2">
                    <div className="flex-1 min-w-[200px] max-w-xs">
                        <CustomerDropdown
                            customers={customers}
                            onSelectCustomer={setSelectedCustomerId}
                            selectedCustomerId={selectedCustomerId}
                        />
                    </div>
                    <button onClick={handleCustomerLogout} className="bg-gray-900 text-sm hover:bg-gray-950 cursor-pointer text-white px-4 py-2 m-2 rounded-full">Logout Customer</button>
                </div>
            </div>

            {/* Categories Section */}
            <div className="w-full">
                <h2 className="text-xl font-semibold mb-2">Categories</h2>

                <div
                    className="grid grid-rows-2 gap-2 lg:grid-cols-4 xl:grid-cols-6 overflow-x-auto p-6 border rounded-lg border-gray-300"
                    style={{ gridAutoFlow: "column" }}
                >
                    {categories &&
                        categories.map((category) => (
                            <CategoryCard key={category._id} category={category} onClick={handleCategoryClick} />
                        ))}
                </div>
            </div>

            {/* Product Search */}
            <div className="w-full max-w-md">
                <input
                    type="text"
                    id="productSearchBar"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); showProductSuggestion.current = true; }}
                    placeholder="Search by product name or model number..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />

                {/* Suggestions */}
                {searchQuery && showProductSuggestion.current && (
                    <ul className="bg-white border border-gray-300 rounded-lg mt-2 shadow-md max-h-48 overflow-y-auto">
                        {filteredProducts.slice(0, 5).map((product) => (
                            <li
                                key={product._id}
                                onClick={() => {
                                    setSearchQuery(product.name);
                                    showProductSuggestion.current = false;
                                }}
                                className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                            >
                                {product.name} ({product.modelNo})
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            {/* Products Section */}
            <div className="w-full flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold mb-4">Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts &&
                        filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                            />
                        ))}
                </div>
            </div>
            <ProductDetailDialog
                open={isProductDialogOpen}
                onOpenChange={setIsProductDialogOpen}
                productInfo={selectedProduct}
            />
        </div>
    );
};

export default RepHomePage;