import ApiMaster from "@/utils/ApiMaster";

const LeaderBoardReportService = {
    async fetchLeaderBoardReport({ startDate, endDate } = {}) {
        try {
            const params = new URLSearchParams();

            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/reports/leadboardReport${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching leaderboard report : ", error.message);
            return [];
        }
    }
};

export default LeaderBoardReportService;