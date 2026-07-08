import RepHeader from '@/components/common/RepHeader'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CustomerService from '@/services/api/CustomerService';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaStore, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe } from "react-icons/fa";
import ProvinceService from '@/services/api/ProvinceService';
import DistrictService from '@/services/api/DistrictService';
import CityService from '@/services/api/CityService';
import CustomToast from '@/components/common/toastify';
import CustomerDetailDialog from '../../../components/common/CustomerDetailDialog';
import Loader from '@/components/common/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogService from '@/services/api/LogService';

const TemporaryCustomers = () => {
    const userID = useSelector(state => state.userInfo.loggedUserID);

    const [customers, setCustomers] = useState([]);
    const [province, setProvince] = useState([]);
    const [provinceID, setProvinceID] = useState(null);
    const [district, setDistrict] = useState([]);
    const [districtID, setDistrictID] = useState(null);
    const [city, setCity] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        shopName: "",
        address: "",
        contactNo: "",
        cityID: "",
        salesRepID: userID,
        statusID: 5
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // Fetch Temporary Customers
            const customerResponse = await CustomerService.fetchCustomers({ salesRepID: userID, statusID: 5 });
            setCustomers(customerResponse.data || []);

            // Fetch Province
            const provinceResponse = await ProvinceService.fetchProvince();
            setProvince(provinceResponse.data || []);

            // Fetch District when provinceID changes
            if (provinceID) {
                const districtResponse = await DistrictService.fetchDistrict({ provinceID });
                setDistrict(districtResponse.data || []);
            }

            // Fetch City when districtID changes
            if (districtID) {
                const cityResponse = await CityService.fetchCity({ districtID });
                setCity(cityResponse.data || []);
            }

        } catch (error) {
            await LogService.createLog({
                "userID": sessionStorage.getItem("loggedUserID"),
                "ui": "TemporaryCustomers",
                "method": "fetchAllData()",
                "errorMsg": error.message || "Rep Temporary Customers failed"
            });
            console.error("Error fetching data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userID) fetchAllData();
    }, [userID, provinceID, districtID]);

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

    // Handle dropdown changes
    const handleProvinceChange = (e) => {
        const selectedID = e.target.value;
        setProvinceID(selectedID);
        setDistrict([]); // reset district when province changes
        setCity([]);     // reset city when province changes
        setFormData({ ...formData, cityID: "" });
    };

    const handleDistrictChange = (e) => {
        const selectedID = e.target.value;
        setDistrictID(selectedID);
        setCity([]); // reset city when district changes
        setFormData({ ...formData, cityID: "" });
    };

    const handleCityChange = (e) => {
        const selectedID = e.target.value;
        setFormData({ ...formData, cityID: selectedID });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.cityID === "") {
            CustomToast.WarningToast("City Must Be Selected!");
            return;
        }

        try {
            setIsLoading(true);
            const response = await CustomerService.createCustomer(formData);
            if (response.statusCode == 200) {
                CustomToast.SuccessToast(response.message);
                setFormData({
                    shopName: "",
                    address: "",
                    contactNo: "",
                    cityID: "",
                    salesRepID: userID,
                    statusID: 5
                });
                setProvince([])
                setDistrict([]);
                setCity([]);
                setProvinceID(null);
                setDistrictID(null);
                return;
            }
            CustomToast.ErrorToast(response.message);
        } catch (error) {
            console.log(error.message);
            CustomToast.ErrorToast("An error occurred during register.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                "ui": "TemporaryCustomers",
                "method": "handleCustomerUpdate()",
                "errorMsg": error.message || "Rep Temporary Customers failed"
            });
            console.error("Error updating customer:", error.message);
            CustomToast.ErrorToast("An error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className=''>
            <RepHeader />
            <h1 className="text-4xl font-bold text-center my-8">Temporary Customers</h1>

            <Tabs defaultValue="register" className="h-screen p-4">
                <TabsList className="w-full">
                    <TabsTrigger className="h-12" value="register">Register</TabsTrigger>
                    <TabsTrigger className="h-12" value="view">View</TabsTrigger>
                    <TabsTrigger className="h-12" value="update">Update</TabsTrigger>
                </TabsList>

                {/* Register Tab */}
                <TabsContent value="register" className="flex justify-center">
                    <form className="space-y-4 my-6 w-full max-w-xl" onSubmit={handleRegister}>
                        <h1 className='text-2xl font-semibold text-center mb-8'>Register Temporary Customer</h1>

                        {/* Shop Name */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaStore className="text-green-600" /> Shop Name
                            </Label>
                            <Input
                                value={formData.shopName}
                                name="shopName"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaMapMarkerAlt className="text-red-600" /> Address
                            </Label>
                            <Input
                                value={formData.address}
                                name="address"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Contact No */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaPhone className="text-blue-600" /> Contact No
                            </Label>
                            <Input
                                value={formData.contactNo}
                                name="contactNo"
                                type="number"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Province Dropdown */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaGlobe className="text-purple-600" /> Province
                            </Label>
                            <select
                                className="border rounded-md p-2"
                                value={provinceID || ""}
                                onChange={handleProvinceChange}
                            >
                                <option value="">Select Province</option>
                                {province.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.province}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District Dropdown */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaCity className="text-indigo-600" /> District
                            </Label>
                            <select
                                className="border rounded-md p-2"
                                value={districtID || ""}
                                onChange={handleDistrictChange}
                            >
                                <option value="">Select District</option>
                                {district.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* City Dropdown */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaMapMarkerAlt className="text-pink-600" /> City
                            </Label>
                            <select
                                className="border rounded-md p-2"
                                value={formData.cityID || ""}
                                onChange={handleCityChange}
                            >
                                <option value="">Select City</option>
                                {city.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Register Button */}
                        <div className="text-right">
                            <button className='bg-gray-950 text-white p-2 rounded-lg hover:scale-105 transition-transform duration-300'>
                                Register
                            </button>
                        </div>
                    </form>
                </TabsContent>

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
                        isUpdate={true}
                        provinceList={province}
                        onUpdate={handleCustomerUpdate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TemporaryCustomers;