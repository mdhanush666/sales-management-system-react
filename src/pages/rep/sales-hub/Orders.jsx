import Loader from "@/components/common/Loader";
import OrderDetailDialog from "@/components/common/OrderDetailDialog";
import RepHeader from "@/components/common/RepHeader";
import CustomToast from "@/components/common/toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogService from "@/services/api/LogService";
import OrderService from "@/services/api/OrderService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

const RepOrders = () => {

    const loggedUserID = useSelector(state => state.userInfo.loggedUserID);

    const [pendingOrders, setPendingOrders] = useState([]);
    const [confirmOrders, setConfirmOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const pendingOrdersResponse = await OrderService.fetchOrder({ salesRepID: loggedUserID, statusID: 2 });
            if (pendingOrdersResponse.success) {
                setPendingOrders(pendingOrdersResponse.data || []);
            } else if (!pendingOrdersResponse.success && pendingOrdersResponse.statusCode === 404) {
                setPendingOrders([]);
            } else {
                CustomToast.ErrorToast(pendingOrdersResponse.message ?? "An Error Fetching Pending Orders");
            }
            const confirmOrdersResponse = await OrderService.fetchOrder({ salesRepID: loggedUserID, statusID: 3 });
            if (confirmOrdersResponse.success) {
                setConfirmOrders(confirmOrdersResponse.data || []);
            } else if (!confirmOrdersResponse.success && confirmOrdersResponse.statusCode === 404) {
                setConfirmOrders([]);
            } else {
                CustomToast.ErrorToast(confirmOrdersResponse.message ?? "An Error Fetching Confirm Orders");
            }
            const cancelledOrdersResponse = await OrderService.fetchOrder({ salesRepID: loggedUserID, statusID: 4 });
            if (cancelledOrdersResponse.success) {
                setCancelledOrders(cancelledOrdersResponse.data || []);
            } else if (!cancelledOrdersResponse.success && cancelledOrdersResponse.statusCode === 404) {
                setCancelledOrders([]);
            } else {
                CustomToast.ErrorToast(cancelledOrdersResponse.message ?? "An Error Fetching Cancelled Orders");
            }

        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "RepOrders",
                "method": "fetchOrders()",
                "errorMsg": error.message || "Rep Orders failed"
            });
            console.log(`Error : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (loggedUserID) fetchOrders();
    }, [loggedUserID]);

    const renderOrderCards = (order) => {
        return (
            <Card
                key={order._id}
                className="w-full max-w-2xl mb-4 rounded-xl border border-gray-200 shadow-sm 
                 hover:shadow-md hover:scale-[1.01] transition-transform duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                    setSelectedOrder(order);
                    setIsDialogOpen(true);
                }}
            >
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                        Order Code: {order.orderCode ?? "N/A"}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        Order Date: {new Date(order.orderDate).toLocaleString()}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span className="font-medium">Customer:</span>
                        <span>{`${order.customerID?.customerCode} - ${order.customerID?.shopName}` ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Cart Code:</span>
                        <span>{order.cartID?.cartCode ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-semibold text-green-700">
                            {order.cartID?.totalAmount?.toLocaleString() ?? "N/A"}
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div>

            <RepHeader />

            <h1 className="text-4xl font-bold text-center my-8">Orders</h1>

            <Tabs defaultValue="pendingOrder" className="h-screen p-4">

                <TabsList className="w-full">
                    <TabsTrigger className="h-12" value="pendingOrder">Pending</TabsTrigger>
                    <TabsTrigger className="h-12" value="confirmOrder">Confirm</TabsTrigger>
                    <TabsTrigger className="h-12" value="cancelledOrder">Cancelled</TabsTrigger>
                </TabsList>

                {/* Pending Orders */}
                <TabsContent value="pendingOrder" className="flex flex-col justify-start my-4 items-center">
                    <h1 className="text-2xl mb-4">Pending Orders</h1>
                    {
                        isLoading ? (<Loader fullscreen={false} message="Fetching Pending Orders.." />) : (
                            pendingOrders && pendingOrders.map(renderOrderCards)
                        )
                    }
                </TabsContent>

                {/* Confirm Orders */}
                <TabsContent value="confirmOrder" className="flex flex-col justify-start my-4 items-center">
                    <h1 className="text-2xl mb-4">Confirm Orders</h1>
                    {
                        isLoading ? (<Loader fullscreen={false} message="Fetching Confirm Orders.." />) : (
                            confirmOrders && confirmOrders.map(renderOrderCards)
                        )
                    }
                </TabsContent>

                {/* Cancelled Orders */}
                <TabsContent value="cancelledOrder" className="flex flex-col justify-start my-4 items-center">
                    <h1 className="text-2xl mb-4">Cancelled Orders</h1>
                    {
                        isLoading ? (<Loader fullscreen={false} message="Fetching Cancelled Orders.." />) : (
                            cancelledOrders && cancelledOrders.map(renderOrderCards)
                        )
                    }
                </TabsContent>

            </Tabs>

            {isDialogOpen &&
                <OrderDetailDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    order={selectedOrder}
                />
            }

        </div>
    )
}

export default RepOrders
