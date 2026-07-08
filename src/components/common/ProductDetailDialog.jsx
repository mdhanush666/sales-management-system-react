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
    FaBarcode,
    FaTag,
    FaAlignLeft,
    FaListAlt,
    FaDollarSign,
    FaToggleOn,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import CustomToast from "@/components/common/toastify";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import CategoryService from "@/services/api/CategoryService";

const ProductDetailDialog = ({
    open,
    onOpenChange,
    product,
    isUpdate = false,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        modelNo: "",
        price: "",
        categoryID: "",
        statusID: "",
    });

    const [statusID, setStatusID] = useState(null);
    const [categoryID, setCategoryID] = useState(null);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        if (product) {
            
            setFormData({
                name: product.name || "",
                description: product.description || "",
                modelNo: product.modelNo || "",
                price: product.price || "",
                categoryID: product.categoryID._id || "",
                statusID: String(product.statusID) ?? "0",
            });
            if (!isUpdate) setCategory([product.categoryID.category]);

            if (product.statusID !== undefined && product.statusID !== null) {
                setStatusID(String(product.statusID));
            } else {
                setStatusID("1");
            }

            const currentCategoryId = product.categoryID?._id || null;
            setCategoryID(currentCategoryId);
        }
    }, [product]);

    const fetchCategories = async () => {
        if (isUpdate) {
            try {
                const response = await CategoryService.fetchCategories({ statusID: 1 });
                setCategory(response.data || []);
            } catch (error) {
                console.error("Error fetching categories:", error.message);
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [isUpdate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        const selectedID = e.target.value;
        setFormData({ ...formData, categoryID: selectedID });
    };

    const handleSubmit = () => {
        if (isUpdate && formData.categoryID === "") {
            CustomToast.WarningToast("Category Must Be Selected for Update!");
            return;
        }

        if (onUpdate && product?._id) {
            onUpdate(product._id, formData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? "Update Product" : "Product Details"}</DialogTitle>
                    <DialogDescription>
                        {isUpdate
                            ? "Modify Product information."
                            : "Full information about the selected product."}
                    </DialogDescription>
                </DialogHeader>

                {product && (
                    <div className="space-y-4">

                        {/* Model No */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaBarcode className="text-indigo-600" /> Model No
                            </Label>
                            <Input
                                name="modelNo"
                                value={isUpdate ? formData.modelNo : product.modelNo}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Name */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaTag className="text-green-600" /> Name
                            </Label>
                            <Input
                                name="name"
                                value={isUpdate ? formData.name : product.name}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaAlignLeft className="text-blue-600" /> Description
                            </Label>
                            <Input
                                name="description"
                                value={isUpdate ? formData.description : product.description}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
                        </div>

                        {/* Category Dropdown */}
                        {isUpdate && (
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <FaListAlt className="text-purple-600" /> Category
                                </Label>
                                <select
                                    className="border rounded-md p-2 bg-white"
                                    value={formData.categoryID || ""}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">Select Category</option>
                                    {category.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Category (read-only) */}
                        {!isUpdate && (
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <FaListAlt className="text-purple-600" /> Category
                                </Label>
                                <Input
                                    name="categoryID"
                                    value={category}
                                    readOnly
                                    className="bg-gray-100"
                                />
                            </div>
                        )}

                        {/* Price */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaDollarSign className="text-yellow-600" /> Price
                            </Label>
                            <Input
                                name="price"
                                type="number"
                                value={isUpdate ? formData.price : product.price}
                                onChange={handleInputChange}
                                readOnly={!isUpdate}
                                className={!isUpdate ? "bg-gray-100" : ""}
                            />
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
                                        <RadioGroupItem value="1" id="r1" />
                                        <Label htmlFor="r1">Active</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="0" id="r2" />
                                        <Label htmlFor="r2">Inactive</Label>
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

export default ProductDetailDialog;