import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "http://localhost:5500/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: (status) => {
        // Axios consider 200-299 range as success and other status codes as error and sends to catch block so - This means all responses except 500 will be treated as successful
        return status !== 500;
    }
});

export default AxiosInstance;