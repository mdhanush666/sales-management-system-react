import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaDollarSign, FaToggleOn } from "react-icons/fa";
import { RiLuggageCartLine } from "react-icons/ri";
import { CiBarcode } from "react-icons/ci";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import CartItemService from "@/services/api/CartItemService";
import CustomToast from "./toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import LogService from "@/services/api/LogService";

const OrderDetailDialog = ({
    open,
    onOpenChange,
    order,
    isUpdate = false,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        statusID: "",
    });

    const [statusID, setStatusID] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItem = async () => {
        if (order) {
            try {
                setIsLoading(true);
                const response = await CartItemService.fetchCartItem({ cartID: order.cartID._id });
                if (response && response.success) {
                    setCartItems(response.data || []);
                } else if (response && !response.success && response.statusCode === 404) {
                    setCartItems([]);
                } else {
                    CustomToast.ErrorToast(response.message ?? "An Error Fetching Cart Items");
                }
            } catch (error) {
                await LogService.createLog({
                    "userID": sessionStorage.getItem("loggedUserID"),
                    "ui": "OrderDetailDialog",
                    "method": "fetchCartItem()",
                    "errorMsg": error.message || "Order Detail Dialog failed"
                });
                console.log(`Error : ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }

    }

    useEffect(() => {
        fetchCartItem();
    }, []);

    useEffect(() => {
        if (order) {
            setFormData({
                statusID: String(order.statusID) ?? "0",
            });

            if (order.statusID !== undefined && order.statusID !== null) {
                setStatusID(String(order.statusID));
            } else {
                setStatusID("1");
            }
        }
    }, [order]);

    const handleSubmit = () => {
        if (onUpdate && order?._id) {
            onUpdate(order._id, formData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? "Update Order" : "Order Details"}</DialogTitle>
                    <DialogDescription>
                        {isUpdate
                            ? "Modify Order information."
                            : "Full information about the selected Order."}
                    </DialogDescription>
                </DialogHeader>

                {order && (
                    <div className="space-y-4">

                        {/* Order Code */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <CiBarcode className="text-indigo-600" /> Order Code
                            </Label>
                            <Input
                                name="orderCode"
                                value={order.orderCode}
                                readOnly
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Cart Code */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <CiBarcode className="text-indigo-600" /> Cart Code
                            </Label>
                            <Input
                                name="cartCode"
                                value={order.cartID.cartCode}
                                readOnly
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Total Amount */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaDollarSign className="text-indigo-600" /> Total Amount
                            </Label>
                            <Input
                                name="cartCode"
                                value={Number(order.cartID.totalAmount).toLocaleString()}
                                readOnly
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <RiLuggageCartLine className="text-indigo-600" /> Products Information
                            </Label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                {cartItems.length > 0 ? (
                                    cartItems.map((productInfo) => (
                                        <Card
                                            key={productInfo._id}
                                            className="hover:scale-105 transition-transform duration-300 ease-in-out"
                                        >
                                            <CardHeader>
                                                <CardTitle className="text-blue-700">
                                                    {productInfo.productID.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {productInfo.productID.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex gap-4 items-center">
                                                <img
                                                    src={productInfo.productID.productImage}
                                                    alt="product-image"
                                                    className="h-20 w-20 rounded-md object-cover"
                                                />
                                                <div className="text-gray-700">
                                                    <p className="font-semibold">{productInfo.productID.name}</p>
                                                    <p className="text-sm">Model: {productInfo.productID.modelNo}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No products found in this order.</p>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        {isUpdate && (
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <FaToggleOn className="text-teal-600" /> Status
                                </Label>
                                <RadioGroup
                                    value={formData.statusID?.toString() || "1"}
                                    onValueChange={(val) => setFormData({ ...formData, statusID: Number(val) })}
                                    className="flex"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="r1" />
                                        <Label htmlFor="r1">Pending</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="3" id="r2" />
                                        <Label htmlFor="r2">Confirm</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="4" id="r3" />
                                        <Label htmlFor="r3">Cancel</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="mt-4">
                    {isUpdate ? (
                        <Button onClick={handleSubmit}>Update</Button>
                    ) : (
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailDialog;