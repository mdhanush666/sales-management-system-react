import { toast, Bounce } from "react-toastify";

const CustomToast = {
    SuccessToast(message, position, autoClose) {
        toast.success(message ?? "Success", {
            position: position ?? "top-center",
            autoClose: autoClose ?? 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    },
    ErrorToast(message, position, autoClose) {
        toast.error(message ?? "Error", {
            position: position ?? "top-center",
            autoClose: autoClose ?? 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    },
    WarningToast(message, position, autoClose) {
        toast.warn(message ?? "Warning", {
            position: position ?? "top-center",
            autoClose: autoClose ?? 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    },
    InfoToast(message, position, autoClose) {
        toast.info(message ?? "Infomation", {
            position: position ?? "top-center",
            autoClose: autoClose ?? 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    },
}

export default CustomToast;