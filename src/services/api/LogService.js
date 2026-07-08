import ApiMaster from "@/utils/ApiMaster";

const LogService = {

    async createLog(body) {
        try {
            const response = await ApiMaster.post("/log/createLog", body);            
            return response;
        } catch (error) {
            console.log(`Error Creating Log : ${error.message}`);
            return [];
        }
    },

    async fetchLogs({ userID } = {}) {
        try {
            const params = new URLSearchParams();

            if (userID) params.append("userID", userID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/log/getLog${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching logs : ", error.message);
            return [];
        }
    },
};

export default LogService;