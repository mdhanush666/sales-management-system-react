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
import { FaUser, FaStore, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaCity, FaGlobe, FaUserTie } from "react-icons/fa";
import { useEffect, useState } from "react";
import DistrictService from '@/services/api/DistrictService';
import CityService from '@/services/api/CityService';
import CustomToast from '@/components/common/toastify';
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const CustomerDetailDialog = ({
    open,
    onOpenChange,
    customer,
    isUpdate = false,
    isAdmin = false,
    provinceList = [],
    onUpdate
}) => {

    const [formData, setFormData] = useState({
        shopName: "",
        address: "",
        contactNo: "",
        cityID: "",
    });

    const [statusID, setStatusID] = useState("5");

    const [provinceID, setProvinceID] = useState(null);
    const [districtID, setDistrictID] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (customer) {
            setFormData({
                shopName: customer.shopName || "",
                address: customer.address || "",
                contactNo: customer.contactNo || "",
                cityID: customer.cityID?._id || "",
            });

            // Initialize statusID from customer data, convert to string for RadioGroup
            if (customer.statusID !== undefined && customer.statusID !== null) {
                setStatusID(String(customer.statusID));
            } else {
                setStatusID("5"); // Default to pending
            }

            const currentCityId = customer.cityID?._id || null;
            const currentDistrictId = customer.cityID?.districtID?._id || null;
            const currentProvinceId = customer.cityID?.districtID?.provinceID?._id || null;

            setProvinceID(currentProvinceId);
            if (currentProvinceId) setDistrictID(currentDistrictId);
        }
    }, [customer]);

    const fetchDistricts = async () => {
        if (provinceID && isUpdate) {
            try {
                const response = await DistrictService.fetchDistrict({ provinceID });
                setDistricts(response.data || []);
                // If the currently selected district doesn't belong to new province, reset it
                const currentDistrictIsValid = response.data?.some(d => d._id === districtID);
                if (!currentDistrictIsValid) {
                    setDistrictID(null);
                    setFormData(prev => ({ ...prev, cityID: "" }));
                    setCities([]);
                }

            } catch (error) {
                console.error("Error fetching districts:", error.message);
            }
        } else if (!provinceID) {
            setDistricts([]);
            setDistrictID(null);
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, [provinceID, isUpdate]);

    const fetchCities = async () => {
        if (districtID && isUpdate) {
            try {
                const response = await CityService.fetchCity({ districtID });
                setCities(response.data || []);
                // If the currently selected city doesn't belong to new district, reset it
                const currentCityIsValid = response.data?.some(c => c._id === formData.cityID);
                if (!currentCityIsValid) {
                    setFormData(prev => ({ ...prev, cityID: "" }));
                }
            } catch (error) {
                console.error("Error fetching cities:", error.message);
            }
        } else if (!districtID) {
            setCities([]);
            setFormData(prev => ({ ...prev, cityID: "" }));
        }
    };

    useEffect(() => {
        fetchCities();
    }, [districtID, isUpdate]);

    // Handlers for form changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProvinceChange = (e) => {
        const selectedID = e.target.value;
        setProvinceID(selectedID);
        setDistrictID(null); // Reset downstream
        setFormData({ ...formData, cityID: "" }); // Reset downstream
    };

    const handleDistrictChange = (e) => {
        const selectedID = e.target.value;
        setDistrictID(selectedID);
        setFormData({ ...formData, cityID: "" }); // Reset downstream
    };

    const handleCityChange = (e) => {
        setFormData({ ...formData, cityID: e.target.value });
    };

    // Handle internal submit for update
    const handleSubmit = () => {
        if (isUpdate && formData.cityID === "") {
            CustomToast.WarningToast("City Must Be Selected for Update!");
            return;
        }

        if (onUpdate && customer?._id) {
            // Create a payload copy
            const payload = { ...formData };

            // If Admin, attach the statusID converted to a Number
            if (isAdmin) {
                payload.statusID = Number(statusID);
            }

            onUpdate(customer._id, payload);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? "Update Customer" : "Customer Details"}</DialogTitle>
                    <DialogDescription>
                        {isUpdate ? "Modify customer information." : "Full information about the selected customer."}
                    </DialogDescription>
                </DialogHeader>

                {customer && (
                    <div className="space-y-4">
                        {/* Customer Code (Always Read-Only) */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaUser className="text-purple-600" /> Customer Code
                            </Label>
                            <Input value={customer.customerCode} readOnly className="bg-gray-100" />
                        </div>

                        {/* Shop Name */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaStore className="text-green-600" /> Shop Name
                            </Label>
                            <Input
                                name="shopName"
                                value={isUpdate ? formData.shopName : customer.shopName}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Contact No */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaPhone className="text-blue-600" /> Contact No
                            </Label>
                            <Input
                                name="contactNo"
                                type="number"
                                value={isUpdate ? formData.contactNo : customer.contactNo}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Address */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaMapMarkerAlt className="text-red-600" /> Address
                            </Label>
                            <Input
                                name="address"
                                value={isUpdate ? formData.address : customer.address}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {!isUpdate ? (
                            // View Mode - Single Read-Only Input
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <FaCity className="text-yellow-600" /> City / District / Province
                                </Label>
                                <Input
                                    value={`${customer.cityID?.city ?? "N/A"}, ${customer.cityID?.districtID?.district ?? "N/A"}, ${customer.cityID?.districtID?.provinceID?.province ?? "N/A"}`}
                                    readOnly
                                    className="bg-gray-100"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                                <h3 className="font-semibold text-gray-700">Update Location</h3>
                                {/* Province Dropdown */}
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        <FaGlobe className="text-purple-600" /> Province
                                    </Label>
                                    <select
                                        className="border rounded-md p-2 bg-white"
                                        value={provinceID || ""}
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">Select Province</option>
                                        {provinceList.map((p) => (
                                            <option key={p._id} value={p._id}>{p.province}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* District Dropdown */}
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        <FaCity className="text-indigo-600" /> District
                                    </Label>
                                    <select
                                        className="border rounded-md p-2 bg-white"
                                        value={districtID || ""}
                                        onChange={handleDistrictChange}
                                        disabled={!provinceID}
                                    >
                                        <option value="">Select District</option>
                                        {districts.map((d) => (
                                            <option key={d._id} value={d._id}>{d.district}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Dropdown */}
                                <div className="grid gap-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        <FaMapMarkerAlt className="text-pink-600" /> City
                                    </Label>
                                    <select
                                        className="border rounded-md p-2 bg-white"
                                        value={formData.cityID || ""}
                                        onChange={handleCityChange}
                                        disabled={!districtID}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((c) => (
                                            <option key={c._id} value={c._id}>{c.city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Joined Date (Read-Only) */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaCalendarAlt className="text-indigo-600" /> Joined Date
                            </Label>
                            <Input value={customer.joinedDate ? new Date(customer.joinedDate).toLocaleDateString() : "N/A"} readOnly className="bg-gray-100" />
                        </div>

                        {/* Sales Rep (Read-Only) */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaUserTie className="text-pink-600" /> Sales Rep
                            </Label>
                            <Input value={customer.salesRepID?.name ?? "N/A"} readOnly className="bg-gray-100" />
                        </div>
                        {/* Approve */}
                        {isAdmin && <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                Approve
                            </Label>
                            <RadioGroup
                                value={statusID}
                                onValueChange={setStatusID}
                                className="flex"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="5" id="r1" />
                                    <Label htmlFor="r1">Pending</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id="r2" />
                                    <Label htmlFor="r2">Confirm</Label>
                                </div>
                            </RadioGroup>
                        </div>}
                    </div>
                )}

                <DialogFooter className="mt-4">
                    {isUpdate || isAdmin ? (
                        // Update Button handles submit internally
                        <Button onClick={handleSubmit}>Update</Button>
                    ) : (
                        // Close button just closes dialog
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerDetailDialog;