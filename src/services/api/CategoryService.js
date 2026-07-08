import ApiMaster from "@/utils/ApiMaster";

const CategoryService = {

    async createCategory(body) {
        try {
            const response = await ApiMaster.post("/category/createCategory", body);
            return response;
        } catch (error) {
            console.log(`Error Creating Category : ${error.message}`);
            return [];
        }
    },

    async fetchCategories({ statusID, id } = {}) {
        try {
            if (id) {
                const response = await ApiMaster.get(`/category/getCategory/${id}`);
                return response;
            }
            const params = new URLSearchParams();

            if (statusID) params.append("statusID", statusID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/category/getCategory${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching categories : ", error.message);
            return [];
        }
    },

    async updateCategory({ id, body }) {
        try {
            const response = await ApiMaster.put(`/category/updateCategory/${id}`, body);
            return response;
        } catch (error) {
            console.log(`Error Update Category : ${error.message}`);
            return [];
        }
    }
};

export default CategoryService;