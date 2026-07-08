import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CustomerService from '@/services/api/CustomerService';
import { useEffect, useState } from 'react'
import CustomToast from '@/components/common/toastify';
import CustomerDetailDialog from '@/components/common/CustomerDetailDialog';
import Loader from '@/components/common/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogService from '@/services/api/LogService';

const AdminTemporaryCustomers = () => {

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // Fetch Temporary Customers
            const customerResponse = await CustomerService.fetchCustomers({ statusID: 5 });
            setCustomers(customerResponse.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AdminTemporaryCustomers",
                "method": "fetchAllData()",
                "errorMsg": error.message || "Admin Temporary Customers failed"
            });
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const renderCustomerCards = (customer) => {
        return <div
            key={customer._id}
            className="flex flex-col items-center justify-center p-2"
            onClick={() => handleCustomerClick(customer)}
        >
            <Card className="w-full max-w-lg mb-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                <CardHeader>
                    <CardTitle>Customer Code: {customer.customerCode ?? "N/A"}</CardTitle>
                    <CardDescription>Shop Name: {customer.shopName ?? "N/A"}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Contact No: {customer.contactNo ?? "N/A"}</p>
                    <p>City: {customer.cityID?.city ?? "N/A"}</p>
                </CardContent>
            </Card>
        </div>
    }

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    const handleCustomerUpdate = async (id, body) => {
        try {
            setIsLoading(true);
            const response = await CustomerService.updateCustomer({ id, body: body });
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setIsDialogOpen(false);
                fetchAllData();
                return;
            } else {
                CustomToast.ErrorToast(response.message || "Update failed");
            }
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "AdminTemporaryCustomers",
                "method": "handleCustomerUpdate()",
                "errorMsg": error.message || "Admin Temporary Customer failed"
            });
            console.error("Error updating customer:", error.message);
            CustomToast.ErrorToast("An error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='bg-white'>
            <h1 className="text-4xl font-bold text-center my-8">Temporary Customers</h1>

            <Tabs defaultValue="view" className="h-screen p-4">
                <TabsList className="w-full">
                    <TabsTrigger className="h-12 bg-gray-100" value="view">View</TabsTrigger>
                    <TabsTrigger className="h-12 bg-gray-100" value="update">Update</TabsTrigger>
                </TabsList>

                {/* View Tab */}
                <TabsContent value="view">
                    <h1 className='text-2xl font-semibold text-center my-8'>View Temporary Customers</h1>
                    {isLoading ? (
                        <Loader fullscreen />
                    ) : (
                        customers.map(renderCustomerCards)
                    )}
                    {/* Dialog */}
                    <CustomerDetailDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        customer={selectedCustomer}
                    />
                </TabsContent>

                {/* Update Tab */}
                <TabsContent value="update">
                    <h1 className='text-2xl font-semibold text-center my-8'>Update Temporary Customers</h1>
                    {isLoading ? (
                        <Loader fullscreen />
                    ) : (
                        customers.map(renderCustomerCards)
                    )}
                    {/* Dialog */}
                    <CustomerDetailDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        customer={selectedCustomer}
                        isAdmin={true}
                        onUpdate={handleCustomerUpdate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminTemporaryCustomers;