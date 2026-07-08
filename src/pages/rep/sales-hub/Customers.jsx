import Loader from '@/components/common/Loader';
import RepHeader from '@/components/common/RepHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CustomerService from '@/services/api/CustomerService';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomerDetailDialog from '@/components/common/CustomerDetailDialog';
import LogService from '@/services/api/LogService';

const RepCustomers = () => {
    const userID = useSelector(state => state.userInfo.loggedUserID);

    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchCustomer = async () => {
        try {
            const response = await CustomerService.fetchCustomers({ salesRepID: userID, statusID: 1 });
            setCustomers(response.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "RepCustomers",
                "method": "fetchCustomer()",
                "errorMsg": error.message || "Rep Customers failed"
            });
            console.log(`Error : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        if (userID) fetchCustomer();
    }, [userID]);

    const handleClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    return (
        <div>
            <RepHeader />
            <h1 className="text-4xl font-bold text-center mb-8">Customers</h1>

            {isLoading ? (
                <Loader fullscreen />
            ) : (customers && customers.length > 0 ?
                customers.map((customer) => (
                    <div
                        key={customer._id}
                        className="flex flex-col items-center justify-center p-2"
                        onClick={() => handleClick(customer)}
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
                ))
                : <h1 className='text-center text-2xl font-thin flex items-center justify-center min-h-screen'>No Data Found</h1>)}
            {/* Dialog */}
            <CustomerDetailDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default RepCustomers;