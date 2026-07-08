import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ✅ Confirmation Dialog
export const ConfirmationDialog = ({
    open,
    onOpenChange,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full rounded-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>

                <div className="mt-4 flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        className="border-gray-300"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Confirm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ✅ Message Dialog (OK only)
export const MessageDialog = ({
    open,
    onOpenChange,
    title,
    message,
    onOk,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full rounded-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>

                <div className="mt-4 flex items-center justify-end">
                    <Button
                        onClick={onOk}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        OK
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};