import ApiMaster from "@/utils/ApiMaster";

const DistrictService = {
    async fetchDistrict({ provinceID } = {}) {
        try {
            const params = new URLSearchParams();

            if (provinceID) params.append("provinceID", provinceID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/district/getDistrict${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching district : ", error.message);
            return [];
        }
    }
};

export default DistrictService;