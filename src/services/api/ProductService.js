import ApiMaster from "@/utils/ApiMaster";

const ProductService = {
    async createProduct(body) {
        try {
            const response = await ApiMaster.post("/product/createProduct", body);
            return response;
        } catch (error) {
            console.log(`Error Creating Product : ${error.message}`);
            return [];
        }
    },
    async fetchProduct({ categoryID, statusID, id } = {}) {
        try {
            if (id) {
                const response = await ApiMaster.get(`/product/getProduct/${id}`);
                return response;
            }
            const params = new URLSearchParams();

            if (categoryID) params.append("categoryID", categoryID);
            if (statusID) params.append("statusID", statusID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/product/getProduct${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching products : ", error.message);
            return [];
        }
    },
    async updateProduct({ id, body }) {
        try {
            const response = await ApiMaster.put(`/product/updateProduct/${id}`, body);
            return response;
        } catch (error) {
            console.log(`Error Update Product : ${error.message}`);
            return [];
        }
    }
};

export default ProductService;