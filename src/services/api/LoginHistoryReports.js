import ApiMaster from "@/utils/ApiMaster";

const LoginHistoryReportService = {
    async fetchLoginHistoryReport({ userID, role, startDate, endDate, reportType } = {}) {
        try {
            const params = new URLSearchParams();

            if (userID) params.append("userID", userID);
            if (role) params.append("role", role);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            if (reportType) params.append("reportType", reportType);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/reports/loginHistoryReport${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching loginHistory report : ", error.message);
            return [];
        }
    }
};

export default LoginHistoryReportService;