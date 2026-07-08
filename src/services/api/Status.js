import ApiMaster from "@/utils/ApiMaster";

const StatusService = {
    async fetchStatus() {
        try {
            const response = await ApiMaster.get(
                "/status/getStatus"
            );
            return response;
        } catch (error) {
            console.error("Error fetching status : ", error.message);
            return [];
        }
    },
    async createStatus(body) {
        try {
            const response = await ApiMaster.post("/status/createStatus", body);
            return response;
        } catch (error) {
            console.log(`Error Creating Status : ${error.message}`);
            return [];
        }
    }
};

export default StatusService;