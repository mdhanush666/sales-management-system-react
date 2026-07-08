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
import {
    FaTag,
    FaHome,
    FaPhone,
    FaUser,
    FaLock,
    FaUserShield,
    FaToggleOn,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const UserDetailDialog = ({
    open,
    onOpenChange,
    user,
    isUpdate = false,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        userName: "",
        password: "",
        role: "",
        statusID: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
                userName: user.userName || "",
                password: "",
                role: user.role || "",
                statusID: String(user.statusID) ?? "0",
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (onUpdate && user?._id) {
            onUpdate(user._id, formData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? "Update User" : "User Details"}</DialogTitle>
                    <DialogDescription>
                        {isUpdate
                            ? "Modify User information."
                            : "Full information about the selected user."}
                    </DialogDescription>
                </DialogHeader>

                {user && (
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaTag className="text-green-600" /> Name
                            </Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Address */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaHome className="text-blue-600" /> Address
                            </Label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaPhone className="text-indigo-600" /> Phone Number
                            </Label>
                            <Input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Username */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaUser className="text-purple-600" /> Username
                            </Label>
                            <Input
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Password */}
                        {isUpdate && <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaLock className="text-red-600" /> Password
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="[optional]"
                                value={formData.password}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>}

                        {/* Role */}
                        {isUpdate && (
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <FaUserShield className="text-yellow-600" /> Role
                                </Label>
                                <RadioGroup
                                    value={formData.role}
                                    onValueChange={(val) => setFormData({ ...formData, role: val })}
                                    className="flex space-x-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="admin" id="role-admin" />
                                        <Label htmlFor="role-admin">Admin</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="salesRep" id="role-rep" />
                                        <Label htmlFor="role-rep">Sales Rep</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}
                        {/* Role */}
                        {!isUpdate && <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaUser className="text-purple-600" /> Role
                            </Label>
                            <Input
                                name="role"
                                value={formData.role}
                                readOnly
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>}

                        {/* Status */}
                        {isUpdate && (
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <FaToggleOn className="text-teal-600" /> Status
                                </Label>
                                <RadioGroup
                                    value={formData.statusID?.toString() || "1"}
                                    onValueChange={(val) =>
                                        setFormData({ ...formData, statusID: Number(val) })
                                    }
                                    className="flex space-x-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="status-active" />
                                        <Label htmlFor="status-active">Active</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="0" id="status-inactive" />
                                        <Label htmlFor="status-inactive">Inactive</Label>
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

export default UserDetailDialog;