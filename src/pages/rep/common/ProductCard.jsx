import CustomToast from "@/components/common/toastify";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addToCart } from "@/store/slice/cartSlice";
import { IoAddCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = ({ product, onClick }) => {

    const cartData = useSelector(state => state.cartInfo.cartData);
    const isCustomerSelected = useSelector(state => state.userInfo.selectedCustomerID);
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.stopPropagation(); // prevent triggering the card click

        const isDuplicateItem = cartData && cartData.some(p => p._id === product._id);

        if (isDuplicateItem) {
            CustomToast.WarningToast(`${product.name} already available in the cart`);
            return;
        } else if (!isCustomerSelected) {
            CustomToast.InfoToast(' please select a customer first!');
            return;
        }
        else {
            dispatch(addToCart(product));
            CustomToast.SuccessToast(`${product.name} added to the cart`);
        }

    };

    return (
        <Card
            onClick={() => onClick(product._id)}
            className="cursor-pointer hover:scale-105 transition-transform duration-300 
                 shadow-lg rounded-xl bg-linear-to-br from-gray-800 to-gray-950 
                 text-white w-60 flex flex-col p-0"
        >
            {/* Product Image */}
            <div className="h-32 w-full overflow-hidden rounded-t-lg">
                <img
                    src={product.productImage}
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Product Info */}
            <CardHeader className="text-lg font-bold text-center">
                {product.name ?? "N/A"}
            </CardHeader>

            <CardContent className="flex flex-col space-y-2 px-3 pb-3">
                <div className="flex justify-between text-sm">
                    <span>Model:</span>
                    <span>{product.modelNo ?? "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span>{typeof product.price === "number" ? product.price.toFixed(2) : "N/A"}</span>
                </div>

                {/* Add to Cart Icon */}
                <div className="flex justify-end">
                    <IoAddCircleOutline
                        size={22}
                        onClick={handleAddToCart}
                        className="text-white hover:text-green-500 transition-colors cursor-pointer"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;