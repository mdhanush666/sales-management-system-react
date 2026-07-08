import ApiMaster from "@/utils/ApiMaster";

const CityService = {

    async createCity(body) {
        try {
            const response = await ApiMaster.post("/city/addcity", body);
            return response;
        } catch (error) {
            console.log(`Error Creating City : ${error.message}`);
            return [];
        }
    },

    async fetchCity({ districtID } = {}) {
        try {
            const params = new URLSearchParams();

            if (districtID) params.append("districtID", districtID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/city/getCity${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching city : ", error.message);
            return [];
        }
    }
};

export default CityService;