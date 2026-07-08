import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useDispatch } from "react-redux"
import { setSelectedCustomerID } from "@/store/slice/userSlice"

// Helper function to format the customer label
const formatCustomerLabel = (customer) =>
    `${customer.customerCode} - ${customer.shopName}`;


function CustomerDropdown({
    customers,
    selectedCustomerId,
    onSelectCustomer
}) {
    const [open, setOpen] = React.useState(false);

    // Determine the current display label
    const selectedCustomerLabel = React.useMemo(() => {
        if (!selectedCustomerId || !customers) return "";
        const customer = customers.find((c) => c._id === selectedCustomerId);
        return customer ? formatCustomerLabel(customer) : "";
    }, [selectedCustomerId, customers]);

    const dispatch = useDispatch();

    // Handle selection change
    const handleSelect = (currentId) => {
        // Toggle logic: If the same item is selected, deselect it, otherwise select the new item.
        const newValue = currentId === selectedCustomerId ? null : currentId;
        onSelectCustomer(newValue);
        dispatch(setSelectedCustomerID(newValue));
        setOpen(false);
    };

    const customerOptions = customers || [];

    return (
        <div className="my-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        // Adjust width to be flexible or wider if needed for long shop names
                        className="w-full justify-between min-w-[200px]"
                    >
                        {selectedCustomerLabel
                            ? selectedCustomerLabel // Display the formatted label
                            : "Select Customer..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                {/* Set PopoverContent width to match the trigger button */}
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command>
                        {/* The CommandInput handles the search/filter logic automatically */}
                        <CommandInput
                            placeholder="Search customer (Name or Code)..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>No customers found.</CommandEmpty>
                            <CommandGroup>
                                {customerOptions.map((customer) => {
                                    // Create a searchable value using both fields
                                    const searchableValue = `${customer.shopName} ${customer.customerCode}`.toLowerCase();

                                    return (
                                        <CommandItem
                                            key={customer._id}
                                            // Use the combination of name and code as the value for the search filter
                                            value={searchableValue}
                                            onSelect={() => handleSelect(customer._id)}
                                        >
                                            {formatCustomerLabel(customer)}
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    selectedCustomerId === customer._id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default CustomerDropdown;