import AdminHeader from '@/components/common/AdminHeader';
import Loader from '@/components/common/Loader';
import CustomToast from '@/components/common/toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CityService from '@/services/api/CityService';
import DistrictService from '@/services/api/DistrictService';
import LogService from '@/services/api/LogService';
import ProvinceService from '@/services/api/ProvinceService';
import React, { useEffect, useState } from 'react';
import { FaCity, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';

const FeedCities = () => {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [province, setProvince] = useState([]);
    const [provinceID, setProvinceID] = useState(null);
    const [district, setDistrict] = useState([]);
    const [districtID, setDistrictID] = useState(null);
    const [formData, setFormData] = useState({
        districtID: '',
        city: ''
    });

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const provinceResponse = await ProvinceService.fetchProvince();
            setProvince(provinceResponse.data || []);

            if (provinceID) {
                const districtResponse = await DistrictService.fetchDistrict({ provinceID });
                setDistrict(districtResponse.data || []);
            }
        } catch (error) {
            await LogService.createLog({
                userID: localStorage.getItem('loggedUserID'),
                ui: 'FeedCities',
                method: 'fetchAllData()',
                errorMsg: error.message || 'Admin Feed Cities failed'
            });
            console.error('Error fetching data:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [provinceID]);

    const fetchCities = async () => {
        setIsLoading(true);
        try {
            const cityResponse = await CityService.fetchCity();
            setCities(cityResponse.data || []);
        } catch (error) {
            await LogService.createLog({
                userID: localStorage.getItem('loggedUserID'),
                ui: 'FeedCities',
                method: 'fetchCities()',
                errorMsg: error.message || 'Admin Feed Cities failed'
            });
            console.error('Error fetching data:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProvinceChange = (e) => {
        const selectedID = e.target.value;
        setProvinceID(selectedID);
        setDistrict([]);
        setDistrictID(null);
        setFormData({ ...formData, districtID: '' });
    };

    const handleDistrictChange = (e) => {
        const selectedID = e.target.value;
        setDistrictID(selectedID);
        setFormData({ ...formData, districtID: selectedID });
    };

    const handleAddCity = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await CityService.createCity(formData);
            if (response && response.success) {
                CustomToast.SuccessToast(response.message);
                setFormData({ districtID: '', city: '' });
                setProvinceID(null);
                setDistrictID(null);
                fetchCities();
            } else {
                CustomToast.ErrorToast(response.message || 'Add City failed');
            }
        } catch (error) {
            await LogService.createLog({
                userID: localStorage.getItem('loggedUserID'),
                ui: 'FeedCities',
                method: 'handleAddCity()',
                errorMsg: error.message || 'Admin Feed City failed'
            });
            console.error('Error updating city:', error);
            CustomToast.ErrorToast('An error occurred during create city.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader message="fetching city data.." fullscreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <AdminHeader />

            {/* Form Section */}
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 my-6">
                <form onSubmit={handleAddCity} className="space-y-4">
                    {/* Province Dropdown */}
                    <div>
                        <Label className="flex items-center gap-2 text-gray-700 mb-1">
                            <FaGlobe className="text-purple-600" /> Province
                        </Label>
                        <select
                            className="border rounded-md p-2 w-full"
                            value={provinceID || ''}
                            onChange={handleProvinceChange}
                            required
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
                    <div>
                        <Label className="flex items-center gap-2 text-gray-700 mb-1">
                            <FaCity className="text-indigo-600" /> District
                        </Label>
                        <select
                            className="border rounded-md p-2 w-full"
                            value={districtID || ''}
                            onChange={handleDistrictChange}
                            required
                        >
                            <option value="">Select District</option>
                            {district.map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.district}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City Input */}
                    <div>
                        <Label htmlFor="city" className="flex items-center gap-2 text-gray-700 mb-1">
                            <FaMapMarkerAlt className="text-pink-600" /> City
                        </Label>
                        <Input
                            id="city"
                            name="city"
                            autoComplete="off"
                            required
                            placeholder="Enter City Name.."
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    <Button className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto">Add City</Button>
                </form>
            </div>

            {/* City Table */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Available Cities</h1>

            {!cities || cities.length === 0 ? (
                <h1 className="text-center my-10 text-gray-500">No City Found</h1>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Province</th>
                                <th className="py-3 px-4 text-left">District</th>
                                <th className="py-3 px-4 text-left">City</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.map((c) => (
                                <tr
                                    key={c._id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="py-2 px-4">{c.districtID?.provinceID?.province ?? 'N/A'}</td>
                                    <td className="py-2 px-4">{c.districtID?.district ?? 'N/A'}</td>
                                    <td className="py-2 px-4">{c.city ?? 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FeedCities;