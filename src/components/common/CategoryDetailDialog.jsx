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
import { FaTag, FaToggleOn } from "react-icons/fa";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const CategoryDetailDialog = ({
    open,
    onOpenChange,
    category,
    isUpdate = false,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        category: "",
        statusID: "",
    });

    const [statusID, setStatusID] = useState(null);

    useEffect(() => {
        if (category) {

            setFormData({
                category: category.category || "",
                statusID: String(category.statusID) ?? "0",
            });

            if (category.statusID !== undefined && category.statusID !== null) {
                setStatusID(String(category.statusID));
            } else {
                setStatusID("1");
            }
        }
    }, [category]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (onUpdate && category?._id) {
            onUpdate(category._id, formData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? "Update Category" : "Category Details"}</DialogTitle>
                    <DialogDescription>
                        {isUpdate
                            ? "Modify Category information."
                            : "Full information about the selected category."}
                    </DialogDescription>
                </DialogHeader>

                {category && (
                    <div className="space-y-4">

                        {/* Model No */}
                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <FaTag className="text-indigo-600" /> Category
                            </Label>
                            <Input
                                name="category"
                                value={isUpdate ? formData.category : category.category}
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

export default CategoryDetailDialog;