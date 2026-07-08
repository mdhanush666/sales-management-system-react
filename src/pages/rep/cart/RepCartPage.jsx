import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { clearCart, removeFromCart } from "@/store/slice/cartSlice";
import { ConfirmationDialog } from "@/components/common/CustomDialog";
import CartService from "@/services/api/CartService";
import CustomToast from "@/components/common/toastify";
import { clearSelectedCustomerID } from "@/store/slice/userSlice";
import OrderService from "@/services/api/OrderService";
import Loader from "@/components/common/Loader";
import LogService from "@/services/api/LogService";

const RepCartPage = () => {
    const cartData = useSelector((state) => state.cartInfo.cartData);

    const dispatch = useDispatch();

    const loggedUserID = useSelector(state => state.userInfo.loggedUserID);
    const selectedCustomerID = useSelector(state => state.userInfo.selectedCustomerID);

    const [isLoading, setIsLoading] = useState(false);

    // Quantity state per productID
    const [quantities, setQuantities] = useState(() => {
        const initial = {};
        cartData?.forEach((item) => {
            initial[item._id] = 1; // default qty = 1
        });
        return initial;
    });

    // Confirm dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Derived summary values
    const { totalAmount, totalQty } = useMemo(() => {
        const totals = cartData?.reduce((acc, items) => {
            const qty = quantities[items._id] ?? 1;
            acc.totalAmount += qty * (Number(items.price) || 0);
            acc.totalQty += qty;
            return acc;
        },
            { totalAmount: 0, totalQty: 0 }
        ) || { totalAmount: 0, totalQty: 0 };

        return {
            totalAmount: totals.totalAmount,
            totalQty: totals.totalQty,
        };
    }, [cartData, quantities]);

    // Update quantity (ensure min 1)
    const handleQtyChange = (productId, value) => {
        const numeric = Math.max(1, Number(value) || 1); // to get max number so -values won't come
        setQuantities((prev) => ({ ...prev, [productId]: numeric }));
    };

    // Build payload for confirmation
    const buildCartPayload = () => {
        const products = cartData.map((item) => ({
            productID: item._id,
            quantity: quantities[item._id] ?? 1,
            price: Number(item.price) || 0,
        }));

        return {
            products,
            totalAmount: Number(totalAmount.toFixed(2)),
            customerID: selectedCustomerID,
            salesRepID: loggedUserID,
            statusID: 1,
        };
    };

    const handleConfirm = async () => {
        const payload = buildCartPayload();

        try {
            setIsLoading(true);
            const response = await CartService.createCart(payload);
            if (response && response.success) {
                const orderResponse = await OrderService.createOrder({
                    "cartID": response.data._id,
                    "customerID": selectedCustomerID,
                    "salesRepID": loggedUserID,
                    "statusID": 2
                });
                if (orderResponse.success) {
                    CustomToast.SuccessToast(orderResponse.message);
                    handleCartClear();
                    dispatch(clearSelectedCustomerID());
                    setConfirmOpen(false);
                    return;
                } else {
                    CustomToast.ErrorToast(orderResponse.message);
                    setConfirmOpen(false);
                    return;
                }
            } else {
                CustomToast.ErrorToast(response.message);
                setConfirmOpen(false);
                return;
            }
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "RepCartPage",
                "method": "handleConfirm()",
                "errorMsg": error.message || "Rep Cart failed"
            });
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }

        setConfirmOpen(false);
    };

    // Delete Item From Cart..
    function handleItemDelete(id) {
        dispatch(removeFromCart(id));
    }
    // Clear Cart..
    function handleCartClear() {
        dispatch(clearCart());
    }

    if (isLoading) {
        return <Loader fullscreen message="Creating Cart and Placing the Order.." />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page title */}
            <div className="flex justify-center pt-8">
                <h1 className="text-4xl font-bold tracking-widest text-gray-900">Cart</h1>
            </div>

            {/* Divider with count badge */}
            <div className="relative max-w-3xl mx-auto mt-8">
                <div className="border-t border-gray-200"></div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {cartData?.length || 0} items
                    </span>
                </div>
            </div>

            {/* Cards section*/}
            <div className="max-w-3xl mx-auto mt-6 p-4">
                <div className="flex justify-end">
                    <button className="my-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-full p-2" onClick={handleCartClear}> clear all </button>
                </div>
                <div
                    className="rounded-2xl bg-white shadow-md border border-gray-100 p-4 md:p-6 min-h-70"
                    style={{ height: "70vh", overflowY: "auto" }}
                >
                    {(!cartData || cartData.length === 0) && (
                        <div className="flex h-full items-center justify-center text-gray-500">
                            No items in cart
                        </div>
                    )}

                    <div className="space-y-4">
                        {cartData?.map((item) => {
                            const qty = quantities[item._id] ?? 1;
                            const lineTotal = qty * (Number(item.price) || 0);

                            return (
                                <div
                                    key={item._id}
                                    className="mx-auto w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-4 md:p-5 flex flex-row gap-4">
                                        {/* Image */}
                                        <div className="shrink-0">
                                            <img
                                                src={item.productImage}
                                                alt={item.name}
                                                className="w-28 h-28 object-cover rounded-lg border border-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">

                                            <div className="flex justify-between">
                                                <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                                                <MdOutlineDeleteOutline size={24} onClick={() => { handleItemDelete(item._id) }} className="text-red-600 cursor-pointer hover:scale-125 transition-transform duration-300" />
                                            </div>
                                            <p className="text-sm text-gray-500">Model: {item.modelNo}</p>
                                            <p className="text-sm text-gray-500">
                                                Category: {item.categoryID?.category}
                                            </p>
                                            <p className="text-sm text-gray-500">Price: {Number(item.price).toLocaleString()}</p>


                                            {/* Description */}
                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2 italic">
                                                {item.description}
                                            </p>

                                            {/* Quantity + total */}
                                            <div className="flex items-center justify-end gap-2 mt-4">
                                                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                                <div className="flex items-center border rounded-md overflow-hidden">
                                                    {/* Decrement button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQtyChange(item._id, (qty - 1))}
                                                        disabled={qty <= 1}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                                    >
                                                        -
                                                    </button>

                                                    {/* Input field */}
                                                    <input
                                                        type="text"
                                                        min={1}
                                                        step={1}   // blocks decimals
                                                        value={qty}
                                                        onChange={(e) => handleQtyChange(item._id, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "." || e.key === ",") e.preventDefault(); // block decimals
                                                        }}
                                                        className="w-16 text-center outline-none border-0 focus:ring-0"
                                                    />

                                                    {/* Increment button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQtyChange(item._id, (qty + 1))}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-6 rounded-2xl bg-white shadow-md border border-gray-100 p-4 md:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                            <p className="text-sm text-gray-500">Total quantity</p>
                            <p className="text-2xl font-extrabold text-gray-900">{totalQty}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                            <p className="text-sm text-gray-500">Total amount</p>
                            <p className="text-2xl font-bold text-green-700">
                                {Number(totalAmount).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Confirm button */}
                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={() => setConfirmOpen(true)}
                            disabled={cartData.length === 0}
                            className="bg-linear-to-tr from-gray-600 to-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg shadow hover:shadow-md hover:scale-[1.02] transition"
                        >
                            Confirm Cart
                        </Button>
                    </div>
                </div>
            </div>

            {/* Confirm dialog */}
            <ConfirmationDialog
                title={"Cart Confirmation"}
                message={"Are you sure to confirm the cart?"}
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default RepCartPage;