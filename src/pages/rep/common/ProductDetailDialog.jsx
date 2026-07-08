import CustomToast from "@/components/common/toastify";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { addToCart } from "@/store/slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductDetailDialog = ({ open, onOpenChange, productInfo }) => {

    const cartData = useSelector(state => state.cartInfo.cartData);
    const isCustomerSelected = useSelector(state => state.userInfo.selectedCustomerID);
    const dispatch = useDispatch();

    function AddToCart() {
        const isDuplicateItem = cartData && cartData.some(p => p._id === productInfo._id);

        if (isDuplicateItem) {
            CustomToast.WarningToast(`${productInfo.name} Already In Cart`);
            return;
        } else if (!isCustomerSelected) {
            CustomToast.InfoToast(' Please Select A Customer First');
            return;
        }
        else {
            dispatch(addToCart(productInfo));
            CustomToast.SuccessToast(`${productInfo.name} Alreaded To Cart`);
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-full rounded-2xl shadow-2xl bg-white 
                   transition-transform duration-300 ease-in-out"
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Product Detail
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {productInfo && `${productInfo.name} Information`}
                    </DialogDescription>
                </DialogHeader>

                {productInfo && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        {/* Product Image */}
                        <div className="flex justify-center items-start">
                            <img
                                className="rounded-xl shadow-md max-h-80 object-cover 
                           transition-transform duration-300 hover:scale-105"
                                src={productInfo.productImage}
                                alt="product image"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                {productInfo.name}
                            </h1>
                            <h3 className="text-lg font-semibold text-gray-700">
                                Model: {productInfo.modelNo}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {productInfo.description}
                            </p>
                            <h4 className="text-md font-medium text-blue-600">
                                Category: {productInfo.categoryID.category}
                            </h4>
                            <p className="text-xl font-bold text-green-600">
                                Rs. {typeof productInfo.price === 'number' ? productInfo.price.toFixed(2) : "N/A"}
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex gap-2 justify-end">
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                        onClick={AddToCart}
                    >
                        Add to Cart
                    </button>
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg border text-white border-gray-300 bg-red-600 font-medium hover:bg-red-700 transition"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailDialog;