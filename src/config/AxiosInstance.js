import axios from "axios";
import apiHostUrl from "./apiHostUrl";

const AxiosInstance = axios.create({
    baseURL: apiHostUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: (status) => {
        // Axios consider 200-299 range as success and other status codes as error and sends to catch block so - This means all responses except 500 will be treated as successful
        return status !== 500;
    }
});

export default AxiosInstance;