import Loader from '@/components/common/Loader';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import CustomerService from '@/services/api/CustomerService';
import React, { useEffect, useState } from 'react';
import CustomerDetailDialog from '@/components/common/CustomerDetailDialog';
import LogService from '@/services/api/LogService';

const ConfirmedCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCustomer = async () => {
        try {
            setIsLoading(true);
            const response = await CustomerService.fetchCustomers({ statusID: 1 });
            setCustomers(response.data || []);
        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "ConfirmCustomers",
                "method": "fetchCustomer()",
                "errorMsg": error.message || "Admin Customer Confirmed failed"
            });
            console.log(`Error : ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    const handleClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    // Filter customers by code, shopName, or salesRep name
    const filteredCustomers = customers.filter((c) => {
        const query = searchQuery.toLowerCase();
        return (
            c.customerCode?.toLowerCase().includes(query) ||
            c.shopName?.toLowerCase().includes(query) ||
            c.salesRepID?.name?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
                    Confirmed Customers
                </h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by code, shop name, or sales rep..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {isLoading ? (
                    <Loader fullscreen />
                ) : filteredCustomers.length === 0 ? (
                    <p className="text-center text-red-500 font-semibold mt-10">
                        🚫 No customers found matching your search.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCustomers.map((customer) => (
                            <Card
                                key={customer._id}
                                onClick={() => handleClick(customer)}
                                className="cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
                            >
                                <CardHeader>
                                    <CardTitle className="text-blue-600">
                                        Customer Code: {customer.customerCode ?? 'N/A'}
                                    </CardTitle>
                                    <CardDescription>
                                        Shop Name: {customer.shopName ?? 'N/A'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-row justify-start">
                                    <div className='font-semibold'>
                                        <p>Contact No</p>
                                        <p>City</p>
                                        <p>Sales Rep</p>
                                    </div>
                                    <div className='text-gray-700 px-4'>
                                        <p>{customer.contactNo ?? 'N/A'}</p>
                                        <p>{customer.cityID?.city ?? 'N/A'}</p>
                                        <p>{customer.salesRepID?.name ?? 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Dialog */}
                <CustomerDetailDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    customer={selectedCustomer}
                />
            </div>
        </div>
    );
};

export default ConfirmedCustomers;