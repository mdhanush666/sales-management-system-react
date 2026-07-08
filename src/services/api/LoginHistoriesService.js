import ApiMaster from "@/utils/ApiMaster";

const LoginHistoryService = {
    async fetchLoginHistory({ userID } = {}) {
        try {
            const params = new URLSearchParams();

            if (userID) params.append("userID", userID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/loginHistory/getLoginHistory${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching loginHistories : ", error.message);
            return [];
        }
    }
};

export default LoginHistoryService;