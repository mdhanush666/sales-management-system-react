import AxiosInstance from "@/config/AxiosInstance";

const ApiMaster = {
    async get(apiURL) {
        try {
            const response = await AxiosInstance.get(apiURL);
            
            return response.data;
        } catch (error) {
            console.log(`GET Error : ${error.message}`);
            return null;
        }
    },
    async post(apiURL, body) {
        try {
            const response = await AxiosInstance.post(apiURL, body);
            return response.data;
        } catch (error) {
            console.log(`POST Error : ${error.message}`);
            return null;
        }
    },
    async put(api, body) {
        try {
            const response = await AxiosInstance.put(api, body);
            return response.data;
        } catch (error) {
            console.error("PUT error:", error.message);
            return null;
        }
    },

    async delete(api, body = {}) {
        try {
            const response = await AxiosInstance.delete(api, body);
            return response.data;
        } catch (error) {
            console.error("DELETE error:", error.message);
            return null;
        }
    },
};

export default ApiMaster;