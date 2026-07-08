import ApiMaster from "@/utils/ApiMaster";

const ProvinceService = {
    async fetchProvince() {
        try {
            const response = await ApiMaster.get("/province/getProvince");
            return response;
        } catch (error) {
            console.error("Error fetching province : ", error.message);
            return [];
        }
    }
};

export default ProvinceService;